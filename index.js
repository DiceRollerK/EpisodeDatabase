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
app.post('/meklet', (req, res) => {
    let meklesanas_id = req.query.meklesanasID;

    let zanrs;
    if (req.query.zanrs) zanrs = req.query.zanrs;

    let serialaID;
    if (req.query.serialaID) { 
        let a = decodeURIComponent(req.query.serialaID);
        serialaID = db.prepare(`SELECT show_id FROM show WHERE name = '${a}' LIMIT 1`).all()[0].show_id;
    }

    let kartosanasID = req.query.kartosanasID; 
    let virzID = req.query.virzID;

    let meklejums = [];
    if (req.query.ievaditais) {
        meklejums = req.query.ievaditais.split(" ");
        if (meklejums == '') {
            meklejums = ['Pier', 'Pressure'];
        }
    }
    let vaicajums;
    switch(meklesanas_id) {
        //kartot() funkcija izmanto vērtības meklēšanas izvēlnēs un tikai ievada "ORDER BY" ja kaut atrod kādu vērtību
        //Meklē visas vērtības
        case '0':
            vaicajums = '';
            for (let i in meklejums) {
                if (i > 0) {
                    vaicajums = vaicajums+' OR ';
                }
                vaicajums = vaicajums+`(ename LIKE '%${meklejums[i]}%' OR s.name LIKE '%${meklejums[i]}%' OR element1 LIKE '%${meklejums[i]}%' OR element2 LIKE '%${meklejums[i]}%' OR element3 LIKE '%${meklejums[i]}%')`
            }

            res.send(db.prepare(`SELECT *, e.name AS ename, CASE
            WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE user.user_id = id_user)) THEN 1
            ELSE 0
            END AS efavourite 
            FROM episode AS e, show AS s, story, user
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (user_id = (SELECT id_user FROM favouriteEpisodes))${zanrs ? ` AND (genre LIKE '%${zanrs}%')` : ''} 
            AND (${vaicajums})
            ORDER BY CASE WHEN (ename LIKE '${req.query.ievaditais}%' OR s.name LIKE '${req.query.ievaditais}%' OR element1 LIKE '${req.query.ievaditais}%' OR element2 LIKE '${req.query.ievaditais}%' OR element3 LIKE '${req.query.ievaditais}%') THEN 1 ELSE 2 END 
            ${kartot(parseInt(kartosanasID), parseInt(virzID), false)};`).all());
        break;
        //Meklē tikai epizožu nosaukums
        case '1':
            vaicajums = '';
            for (let i in meklejums) {
                if (i > 0) {
                    vaicajums = vaicajums+' OR ';
                }
                vaicajums = vaicajums+`(ename LIKE '%${meklejums[i]}%')`
            }
            res.send(db.prepare(`SELECT *, e.name AS ename, CASE
            WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE user.user_id = id_user)) THEN 1
            ELSE 0
            END AS efavourite 
            FROM episode AS e, show AS s, story, user
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (user_id = (SELECT id_user FROM favouriteEpisodes))${zanrs ? ` AND (genre LIKE '%${zanrs}%' )` : ''} 
            AND (${vaicajums})
            ORDER BY CASE WHEN (ename LIKE '${req.query.ievaditais}%') THEN 1 ELSE 2 END 
            ${kartot(parseInt(kartosanasID), parseInt(virzID), false)};`).all());
        break;
        //Meklē tikai seriālu nosaukumus
        case '2':
            vaicajums = '';
            for (let i in meklejums) {
                if (i > 0) {
                    vaicajums = vaicajums+' OR ';
                }
                vaicajums = vaicajums+`(s.name LIKE '%${meklejums[i]}%')`
            }

            res.send(db.prepare(`SELECT *, e.name AS ename, CASE
            WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE user.user_id = id_user)) THEN 1
            ELSE 0
            END AS efavourite 
            FROM episode AS e, show AS s, story, user
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (user_id = (SELECT id_user FROM favouriteEpisodes))${zanrs ? ` AND (genre LIKE '%${zanrs}%')` : ''} 
            AND (${vaicajums})
            ORDER BY CASE WHEN (s.name LIKE '${req.query.ievaditais}%') THEN 1 ELSE 2 END 
            ${kartot(parseInt(kartosanasID), parseInt(virzID), false)};`).all());
        break;
        //Meklē tikai epizodes stāsta elementus
        case '3':
            vaicajums = '';
            for (let i in meklejums) {
                if (i > 0) {
                    vaicajums = vaicajums+' OR ';
                }
                vaicajums = vaicajums+`(element1 LIKE '%${meklejums[i]}%' OR element2 LIKE '%${meklejums[i]}%' OR element3 LIKE '%${meklejums[i]}%')`
            }
            
            res.send(db.prepare(`SELECT *, e.name AS ename, CASE
            WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE user.user_id = id_user)) THEN 1
            ELSE 0
            END AS efavourite 
            FROM episode AS e, show AS s, story, user
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (user_id = (SELECT id_user FROM favouriteEpisodes))${zanrs ? ` AND (genre LIKE '%${zanrs}%')` : ''} 
            AND (${vaicajums})
            ORDER BY CASE WHEN (element1 LIKE '${req.query.ievaditais}%' OR element2 LIKE '${req.query.ievaditais}%' OR element3 LIKE '${req.query.ievaditais}%') THEN 1 ELSE 2 END 
            ${kartot(parseInt(kartosanasID), parseInt(virzID), false)};`).all());
        break;
        //Meklē visas epizodes no kāda seriāla
        case '-1':
            res.send(db.prepare(`SELECT *, e.name AS ename, 
            CASE
                WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE user.user_id = id_user)) THEN 1
                ELSE 0
            END AS efavourite 
            FROM episode AS e, show AS s, story, time, genre, theme, user
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (time_id = id_time) AND (genre_id = id_genre) AND (theme_id = id_theme) AND (user_id = (SELECT id_user FROM favouriteEpisodes))
            AND (show_id = ${serialaID}) ORDER BY season ASC, episode ASC;`).all());
        break;
        //Meklē seriālus un epizodes atzīmētas ar 'mīļots'
        case '-2':
            if (debug) console.log(db.prepare(`SELECT *, e.name AS ename, e.favourite AS efavourite FROM episode AS e, show AS s, story, time, genre, theme
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (time_id = id_time) AND (genre_id = id_genre) AND (theme_id = id_theme)
            AND (e.favourite = 1 OR s.favourite = 1)
            ${kartot(parseInt(kartosanasID), parseInt(virzID), true)};`).all());

            res.send(db.prepare(`SELECT *, e.name AS ename,
            CASE
                    WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE user.user_id = id_user)) THEN 1
                    ELSE 0
            END AS efavourite,
            CASE
                WHEN (show_id IN (SELECT id_show FROM favouriteShows WHERE user.user_id = id_user)) THEN 1
                ELSE 0
            END AS sfavourite
            FROM episode AS e, show AS s, story, time, genre, theme, user
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (time_id = id_time) AND (genre_id = id_genre) AND (theme_id = id_theme) 
            AND (efavourite = 1 OR sfavourite = 1) AND ((user_id = (SELECT id_user FROM favouriteShows)) OR (user_id = (SELECT id_user FROM favouriteShows)))
            ${kartot(parseInt(kartosanasID), parseInt(virzID), true)};`).all());
        break;
    }
})

//Izmanto kārtošanas izvēlni lai saprast kā kārtot
//virzID izvēlās kārtošanas virzienu, 0 ir augstoši, 1 ir dilstoši
function kartot(kartosanasID, virzID, pievienotOrder) {
    switch (kartosanasID) {
        //Nekārto
        case 0:
            return ' ';
        //Kārto pēc seriāla nosaukuma
        case 1:
            if (pievienotOrder) {
                return `ORDER BY s.name ${(virzID == 0 ? 'ASC': 'DESC')}`;
            } else {
                return `, s.name ${(virzID == 0 ? 'ASC': 'DESC')}`;
            }
        //Kārto pēc epizodes nosaukuma
        case 2:
            if (pievienotOrder) {
                return `ORDER BY e.name ${(virzID == 0 ? 'ASC': 'DESC')}`;
            } else {
                return `, e.name ${(virzID == 0 ? 'ASC': 'DESC')}`;
            }
        //Kārto pēc raidīšanas datuma
        case 3:
            if (pievienotOrder) {
                return `ORDER BY date ${(virzID == 0 ? 'ASC': 'DESC')}`;
            } else {
                return `, date ${(virzID == 0 ? 'ASC': 'DESC')}`;
            }
        //Kārto pēc sezonas un epizodes
        case 4:
            if (pievienotOrder) {
                return `ORDER BY season ${(virzID == 0 ? 'ASC': 'DESC')}, episode ${(virzID == 0 ? 'ASC': 'DESC')}`;
            } else {
                return `, season ${(virzID == 0 ? 'ASC': 'DESC')}, episode ${(virzID == 0 ? 'ASC': 'DESC')}`;
            }
    }
}

//Meklē visas epizodes datu bāzē
app.post('/clicked', (req, res) => {
    let kartosanasID = req.query.kartosanasID;
    let virzID = req.query.virzID;
    let zanrs;
    if (req.query.zanrs) zanrs = req.query.zanrs;

    res.send(db.prepare(`SELECT
    e.name AS ename, e.date, e.season, e.episode, e.genre, logo, element1, element2, element3,
	CASE
		WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE user.user_id = id_user)) THEN 1
		ELSE 0
	END AS efavourite
    FROM episode AS e, show AS s, story, user
    WHERE (s.show_id = e.id_show) AND (story_id = e.id_story) AND (user_id = (SELECT id_user FROM favouriteEpisodes))
    ${zanrs ? ` AND (genre LIKE '%${zanrs}%')` : ''}
    ${kartot(parseInt(kartosanasID), parseInt(virzID), true)};`).all());
});

//Meklē visus seriālus datu bāzē
app.get('/seriali', (req, res) => {
    res.send(db.prepare(`SELECT show_id, name, logo, start_date, end_date, genre1, genre2, genre3, theme1, theme2, theme3,
    CASE
        WHEN (show_id IN (SELECT id_show FROM favouriteShows WHERE user.user_id = id_user)) THEN 1
        ELSE 0
        END AS sfavourite
    FROM show, time, genre, theme, user
        WHERE (time_id = id_time) AND (genre_id = id_genre) AND (theme_id = id_theme) AND (user_id = (SELECT id_user FROM favouriteShows));`).all());
});

//Maina epizodu vai seriālu 'iecienit' vērtību
app.post('/iecienit', (req, res) => {
    let f = req.query.iecienit;
    //Ja bija mīļots tad paliek nemīļots un otrādi
    if (f == 1) {
        f = 0;
    } else {
        f = 1;
    }
    let epizode, serials;
    //Pārbauda vai epizodes vai seriāla informācija tiek mainīta
    if (req.query.epizodesID) {
        epizode = req.query.epizodesID;
        db.exec(`UPDATE episode SET favourite = ${f} WHERE episode_id = ${epizode}`);
    } else {
        serials = req.query.serialaID;
        db.exec(`UPDATE show SET favourite = ${f} WHERE show_id = ${serials}`);
    }
    res.send('throw');
});

app.post('/iestatijumi', (req, res) => {
    res.send(db.prepare(`SELECT * FROM settings WHERE id_user = ${req.query.user};`).all());
});

import Database from 'better-sqlite3';
const db = new Database('./database/EpisodeDatabase.db');