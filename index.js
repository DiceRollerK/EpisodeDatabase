//Ievietot datus
//const insert = db.prepare('INSERT INTO time (time_id, start_date, end_date) VALUES (?, ?, ?)');
//insert.run('2','1989-07-05 12:00:00.0000','1998-05-14 12:00:00.0000');

//Izvadīt datus
//console.log(db.prepare('SELECT * FROM time;').all());

let debug = false;

import express from'express';
import path from'path';
const app = express();
const port = 3000;

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname,'static')));
app.listen(port, () => {
    console.log(`Saiti var atrast aizejot uz saiti: http://localhost:${port}`);
});

//Aplikācija izmanto HTML failu savai struktūrai
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//Meklē informāciju SQL datu bāzē
app.post('/search', (req, res) => {
    let search_id = req.query.searchID;

    let genre;
    if (req.query.genre) genre = req.query.genre;

    let showID;
    if (req.query.showid) { 
        let a = decodeURIComponent(req.query.showid);
        showID = db.prepare(`SELECT show_id FROM show WHERE name = '${a}' LIMIT 1`).all()[0].show_id;
    }

    let sortID = req.query.sortID; 
    let dirID = req.query.dirID;

    let searchValue;
    if (req.query.term) {
        searchValue = req.query.term;
        if (searchValue == '') {
            searchValue = 'Pier Pressure'
        }
    }
    switch(search_id) {
        //sort() funkcija izmanto vērtības meklēšanas izvēlnēs un tikai ievada "ORDER BY" ja kaut atrod kādu vērtību
        //Meklē visas vērtības
        case '0':
            if (debug) console.log(`SELECT *, e.name AS ename, e.favourite AS efavourite FROM episode AS e, show AS s, story 
            WHERE (s.show_id = e.id_show) AND (story_id = id_story)${genre ? ` AND (genre LIKE '%${genre}%')` : ''} 
            AND (ename LIKE '%${searchValue}%' OR s.name LIKE '%${searchValue}%' OR element1 LIKE '%${searchValue}%' OR element2 LIKE '%${searchValue}%' OR element3 LIKE '%${searchValue}%'
            ) ${sort(parseInt(sortID, dirID))};`);

            res.send(db.prepare(`SELECT *, e.name AS ename, e.favourite AS efavourite FROM episode AS e, show AS s, story 
            WHERE (s.show_id = e.id_show) AND (story_id = id_story)${genre ? ` AND (genre LIKE '%${genre}%')` : ''} 
            AND (ename LIKE '%${searchValue}%' OR s.name LIKE '%${searchValue}%' OR element1 LIKE '%${searchValue}%' OR element2 LIKE '%${searchValue}%' OR element3 LIKE '%${searchValue}%') 
            ${sort(parseInt(sortID), parseInt(dirID))};`).all());
        break;
        //Meklē tikai epizožu nosaukums
        case '1':
            res.send(db.prepare(`SELECT *, e.name AS ename, e.favourite AS efavourite FROM episode AS e, show AS s, story 
            WHERE (s.show_id = e.id_show) AND (story_id = id_story)${genre ? ` AND (genre LIKE '%${genre}%' )` : ''} 
            AND (ename LIKE '%${searchValue}%') 
            ${sort(parseInt(sortID), parseInt(dirID))};`).all());
        break;
        //Meklē tikai seriālu nosaukumus
        case '2':
            res.send(db.prepare(`SELECT *, e.name AS ename, e.favourite AS efavourite FROM episode AS e, show AS s, story 
            WHERE (s.show_id = e.id_show) AND (story_id = id_story)${genre ? ` AND (genre LIKE '%${genre}%')` : ''} 
            AND (s.name LIKE '%${searchValue}%') 
            ${sort(parseInt(sortID), parseInt(dirID))};`).all());
        break;
        //Meklē tikai epizodes stāsta elementus
        case '3':
            res.send(db.prepare(`SELECT *, e.name AS ename, e.favourite AS efavourite FROM episode AS e, show AS s, story 
            WHERE (s.show_id = e.id_show) AND (story_id = id_story)${genre ? ` AND (genre LIKE '%${genre}%')` : ''} 
            AND (element1 LIKE '%${searchValue}%' OR element2 LIKE '%${searchValue}%' OR element3 LIKE '%${searchValue}%')
            ${sort(parseInt(sortID), parseInt(dirID))};`).all());
        break;
        //Meklē visas epizodes no kāda seriāla
        case '-1':
            res.send(db.prepare(`SELECT *, e.name AS ename, e.favourite AS efavourite FROM episode AS e, show AS s, story, time, genre, theme
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (time_id = id_time) AND (genre_id = id_genre) AND (theme_id = id_theme)
            AND (show_id = ${showID}) ORDER BY season ASC, episode ASC;`).all());
        break;
        //Meklē seriālus un epizodes atzīmētas ar 'mīļots'
        case '-2':
            if (debug) console.log(db.prepare(`SELECT *, e.name AS ename, e.favourite AS efavourite FROM episode AS e, show AS s, story, time, genre, theme
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (time_id = id_time) AND (genre_id = id_genre) AND (theme_id = id_theme)
            AND (e.favourite = 1 OR s.favourite = 1)
            ${sort(parseInt(sortID), parseInt(dirID))};`).all());

            res.send(db.prepare(`SELECT *, e.name AS ename, e.favourite AS efavourite FROM episode AS e, show AS s, story, time, genre, theme
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (time_id = id_time) AND (genre_id = id_genre) AND (theme_id = id_theme)
            AND (e.favourite = 1 OR s.favourite = 1)
            ${sort(parseInt(sortID), parseInt(dirID))};`).all());
        break;
    }
})

//Izmanto kārtošanas izvēlni lai saprast kā kārtot
//dirID izvēlās kārtošanas virzienu, 0 ir augstoši, 1 ir dilstoši
function sort(sortid, dirID) {
    switch (sortid) {
        //Nekārto
        case 0:
            return ' ';
        //Kārto pēc seriāla nosaukuma
        case 1:
            return `ORDER BY s.name ${(dirID == 0 ? 'ASC': 'DESC')}`;
        //Kārto pēc epizodes nosaukuma
        case 2:
            return `ORDER BY e.name ${(dirID == 0 ? 'ASC': 'DESC')}`;
        //Kārto pēc raidīšanas datuma
        case 3:
            return `ORDER BY date ${(dirID == 0 ? 'ASC': 'DESC')}`;
        //Kārto pēc sezonas un epizodes
        case 4:
            return `ORDER BY season ${(dirID == 0 ? 'ASC': 'DESC')}, episode ${(dirID == 0 ? 'ASC': 'DESC')}`;
    }
}

//Meklē visas epizodes datu bāzē
app.post('/clicked', (req, res) => {
    let sortID = req.query.sortID;
    let dirID = req.query.dirID;  
    res.send(db.prepare(`SELECT *, e.name AS ename, e.favourite AS efavourite FROM episode AS e, show AS s, story WHERE (s.show_id = e.id_show) AND (story_id = id_story)
    ${sort(parseInt(sortID), parseInt(dirID))};`).all());
});

//Meklē visus seriālus datu bāzē
app.get('/show', (req, res) => {
    res.send(db.prepare(`SELECT * FROM show, time, genre, theme WHERE (time_id = id_time) AND (genre_id = id_genre) AND (theme_id = id_theme)`).all());
});

//Maina epizodu vai seriālu 'favourite' vērtību
app.post('/favourite', (req, res) => {
    let f = req.query.favourite;
    //Ja bija mīļots tad paliek nemīļots un otrādi
    if (f == 1) {
        f = 0;
    } else {
        f = 1;
    }
    let ep, show;
    //Pārbauda vai epizodes vai seriāla informācija tiek mainīta
    if (req.query.epid) {
        ep = req.query.epid;
        db.exec(`UPDATE episode SET favourite = ${f} WHERE episode_id = ${ep}`);
    } else {
        show = req.query.showid;
        db.exec(`UPDATE show SET favourite = ${f} WHERE show_id = ${show}`);
    }
    res.send('throw');
});

import Database from 'better-sqlite3';
const db = new Database('./database/EpisodeDatabase.db');