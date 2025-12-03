//Ievietot datus
//const insert = db.prepare('INSERT INTO time (time_id, start_date, end_date) VALUES (?, ?, ?)');
//insert.run('2','1989-07-05 12:00:00.0000','1998-05-14 12:00:00.0000');

//Izvadīt datus
//console.log(db.prepare('SELECT * FROM time;').all());

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
    console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    let search_id = req.query.searchID;

    let genre;
    if (req.query.genre) genre = req.query.genre;

    let showID;
    if (req.query.showid) { 
        let a = decodeURIComponent(req.query.showid);
        showID = db.prepare(`SELECT show_id FROM show WHERE name = '${a}' LIMIT 1`).all()[0].show_id;
    }

    let searchValue;
    if (req.query.term) {
        searchValue = req.query.term;
        if (searchValue == '') {
            searchValue = 'Pier Pressure'
        }
    }

    //console.log(`SELECT *, e.name AS ename FROM episode AS e, show AS s, story 
    //    WHERE (s.show_id = e.id_show) AND (story_id = id_story)${genre ? ` AND (genre LIKE '%${genre}%' )` : ''} 
    //    AND (ename LIKE '%${searchValue}%');`);

    if (search_id == 0) {
        res.send(db.prepare(`SELECT *, e.name AS ename FROM episode AS e, show AS s, story 
        WHERE (s.show_id = e.id_show) AND (story_id = id_story)${genre ? ` AND (genre LIKE '%${genre}%')` : ''} 
        AND (ename LIKE '%${searchValue}%' OR s.name LIKE '%${searchValue}%' OR element1 LIKE '%${searchValue}%' OR element2 LIKE '%${searchValue}%' OR element3 LIKE '%${searchValue}%');`).all());
    } else if (search_id == 1) {
        res.send(db.prepare(`SELECT *, e.name AS ename FROM episode AS e, show AS s, story 
        WHERE (s.show_id = e.id_show) AND (story_id = id_story)${genre ? ` AND (genre LIKE '%${genre}%' )` : ''} 
        AND (ename LIKE '%${searchValue}%');`).all());
    } else if (search_id == 2) {
        res.send(db.prepare(`SELECT *, e.name AS ename FROM episode AS e, show AS s, story 
        WHERE (s.show_id = e.id_show) AND (story_id = id_story)${genre ? ` AND (genre LIKE '%${genre}%')` : ''} 
        AND (s.name LIKE '%${searchValue}%');`).all());
    } else if (search_id == 3) {
        res.send(db.prepare(`SELECT *, e.name AS ename FROM episode AS e, show AS s, story 
        WHERE (s.show_id = e.id_show) AND (story_id = id_story)${genre ? ` AND (genre LIKE '%${genre}%')` : ''} 
        AND (element1 LIKE '%${searchValue}%' OR element2 LIKE '%${searchValue}%' OR element3 LIKE '%${searchValue}%');`).all());
    } else if (search_id = -1) {
        res.send(db.prepare(`SELECT *, e.name AS ename FROM episode AS e, show AS s, story, time, genre, theme
        WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (time_id = id_time) AND (genre_id = id_genre) AND (theme_id = id_theme)
        AND (show_id = ${showID}) ORDER BY season ASC, episode ASC;`).all());
    }

})

app.get('/clicked', (req, res) => {
    //let search = document.querySelector("#text-input").value
    //console.log(db.prepare(`SELECT *, e.name AS ename FROM episode AS e, show AS s WHERE s.show_id = e.id_show WHERE ename LIKE '%${search}%'`).all());
    res.send(db.prepare(`SELECT *, e.name AS ename FROM episode AS e, show AS s, story WHERE (s.show_id = e.id_show) AND (story_id = id_story);`).all());
});

app.get('/show', (req, res) => {
    res.send(db.prepare(`SELECT * FROM show, time, genre, theme WHERE (time_id = id_time) AND (genre_id = id_genre) AND (theme_id = id_theme)`).all());
});

import Database from 'better-sqlite3';
const db = new Database('./database/EpisodeDatabase.db');
