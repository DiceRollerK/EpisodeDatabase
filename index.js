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

    //Filtrē epizodes pēc žanra
    let zanrs;
    if (req.query.zanrs) zanrs = req.query.zanrs;

    //Izmanto seriāla nosaukumu lai atrastu ID, kuru izmanto meklējumā kad seriāla logo tiek uzspiests un visas tā epizodes tiek izvadītas
    let serialaID;
    if (req.query.serialaID) { 
        let a = decodeURIComponent(req.query.serialaID);
        serialaID = db.prepare(`SELECT show_id FROM show WHERE name = '${a}' LIMIT 1`).all()[0].show_id;
    }

    //KartosanasID saka pēc kā tiek kārtotas epizodes, virzID saka augoši vai dilstoši
    let kartosanasID = req.query.kartosanasID; 
    let virzID = req.query.virzID;

    //Sadala ievadīto vērtību vārdos, un ievieto tos masīvā
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
            //Meklē katru vārdu ievadītajā vērtība ar katru meklējamo vērtību
            for (let i in meklejums) {
                if (i > 0) {
                    vaicajums = vaicajums+' OR ';
                }
                vaicajums = vaicajums+`(ename LIKE '%${meklejums[i]}%' OR s.name LIKE '%${meklejums[i]}%' OR element1 LIKE '%${meklejums[i]}%' OR element2 LIKE '%${meklejums[i]}%' OR element3 LIKE '%${meklejums[i]}%')`
            }

            res.send(db.prepare(`SELECT s.name, date, season, episode, genre, logo, element1, element2, element3, e.name AS ename, CASE
            WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE id_user = ${req.query.user} AND favourite = 1)) THEN 1
            ELSE 0
            END AS efavourite 
            FROM episode AS e, show AS s, story, user
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (user_id = ${req.query.user})${zanrs ? ` AND (genre LIKE '%${zanrs}%')` : ''} 
            AND (${vaicajums})
            ORDER BY CASE WHEN (ename LIKE '${req.query.ievaditais}%' OR s.name LIKE '${req.query.ievaditais}%' OR element1 LIKE '${req.query.ievaditais}%' OR element2 LIKE '${req.query.ievaditais}%' OR element3 LIKE '${req.query.ievaditais}%') THEN 1 ELSE 2 END 
            ${kartot(parseInt(kartosanasID), parseInt(virzID), false)};`).all());
        break;
        //Meklē tikai epizožu nosaukums
        case '1':
            vaicajums = '';
            //Meklē katru vārdu ievadītajā vērtība ar katru meklējamo vērtību
            for (let i in meklejums) {
                if (i > 0) {
                    vaicajums = vaicajums+' OR ';
                }
                vaicajums = vaicajums+`(ename LIKE '%${meklejums[i]}%')`
            }
            res.send(db.prepare(`SELECT s.name, date, season, episode, genre, logo, element1, element2, element3, e.name AS ename, CASE
            WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE id_user = ${req.query.user} AND favourite = 1)) THEN 1
            ELSE 0
            END AS efavourite 
            FROM episode AS e, show AS s, story, user
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (user_id = ${req.query.user})${zanrs ? ` AND (genre LIKE '%${zanrs}%' )` : ''} 
            AND (${vaicajums})
            ORDER BY CASE WHEN (ename LIKE '${req.query.ievaditais}%') THEN 1 ELSE 2 END 
            ${kartot(parseInt(kartosanasID), parseInt(virzID), false)};`).all());
        break;
        //Meklē tikai seriālu nosaukumus
        case '2':
            vaicajums = '';
            //Meklē katru vārdu ievadītajā vērtība ar katru meklējamo vērtību
            for (let i in meklejums) {
                if (i > 0) {
                    vaicajums = vaicajums+' OR ';
                }
                vaicajums = vaicajums+`(s.name LIKE '%${meklejums[i]}%')`
            }

            res.send(db.prepare(`SELECT s.name, date, season, episode, genre, logo, element1, element2, element3, e.name AS ename, CASE
            WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE id_user = ${req.query.user} AND favourite = 1)) THEN 1
            ELSE 0
            END AS efavourite 
            FROM episode AS e, show AS s, story, user
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (user_id = ${req.query.user})${zanrs ? ` AND (genre LIKE '%${zanrs}%')` : ''} 
            AND (${vaicajums})
            ORDER BY CASE WHEN (s.name LIKE '${req.query.ievaditais}%') THEN 1 ELSE 2 END 
            ${kartot(parseInt(kartosanasID), parseInt(virzID), false)};`).all());
        break;
        //Meklē tikai epizodes stāsta elementus
        case '3':
            vaicajums = '';
            //Meklē katru vārdu ievadītajā vērtība ar katru meklējamo vērtību
            for (let i in meklejums) {
                if (i > 0) {
                    vaicajums = vaicajums+' OR ';
                }
                vaicajums = vaicajums+`(element1 LIKE '%${meklejums[i]}%' OR element2 LIKE '%${meklejums[i]}%' OR element3 LIKE '%${meklejums[i]}%')`
            }
            
            res.send(db.prepare(`SELECT s.name, date, season, episode, genre, logo, element1, element2, element3, e.name AS ename, CASE
            WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE id_user = ${req.query.user} AND favourite = 1)) THEN 1
            ELSE 0
            END AS efavourite 
            FROM episode AS e, show AS s, story, user
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (user_id = ${req.query.user})${zanrs ? ` AND (genre LIKE '%${zanrs}%')` : ''} 
            AND (${vaicajums})
            ORDER BY CASE WHEN (element1 LIKE '${req.query.ievaditais}%' OR element2 LIKE '${req.query.ievaditais}%' OR element3 LIKE '${req.query.ievaditais}%') THEN 1 ELSE 2 END 
            ${kartot(parseInt(kartosanasID), parseInt(virzID), false)};`).all());
        break;
        //Meklē visas epizodes no kāda seriāla
        case '-1':
            res.send(db.prepare(`SELECT s.name, date, season, episode, genre, logo, element1, element2, element3, e.name AS ename, 
                                start_date, end_date, genre1, genre2, genre3, theme1, theme2, theme3, show_id, episode_id,
            CASE
				WHEN (show_id IN (SELECT id_show FROM favouriteShows WHERE id_user = ${req.query.user} AND favourite = 1)) THEN 1
				ELSE 0
			END AS sfavourite, 
            CASE
                WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE id_user = ${req.query.user} AND favourite = 1)) THEN 1
                ELSE 0
            END AS efavourite 
            FROM episode AS e, show AS s, story, time, genre, theme, user
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (time_id = id_time) AND (genre_id = id_genre) AND (theme_id = id_theme) AND (user_id = ${req.query.user})
            AND (show_id = ${serialaID}) ORDER BY season ASC, episode ASC;`).all());
        break;
        //Meklē seriālus un epizodes atzīmētas ar 'mīļots'
        case '-2':
            res.send(db.prepare(`SELECT s.name, date, season, episode, genre, logo, element1, element2, element3, e.name AS ename, 
                                start_date, end_date, genre1, genre2, genre3, theme1, theme2, theme3, show_id, episode_id,
            CASE
				WHEN (show_id IN (SELECT id_show FROM favouriteShows WHERE id_user = ${req.query.user} AND favourite = 1)) THEN 1
				ELSE 0
			END AS sfavourite,
			CASE
				WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE id_user = ${req.query.user} AND favourite = 1)) THEN 1
				ELSE 0
			END AS efavourite
            FROM episode AS e, show AS s, story, time, genre, theme, user
            WHERE (s.show_id = e.id_show) AND (story_id = id_story) AND (time_id = id_time) AND (genre_id = id_genre) AND (theme_id = id_theme) 
            AND (efavourite = 1 OR sfavourite = 1) AND (user_id = ${req.query.user})
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
    s.show_id, e.episode_id, s.name AS name, e.name AS ename, e.date, e.season, e.episode, e.genre, logo, element1, element2, element3,
	CASE
		WHEN (e.episode_id IN (SELECT id_episode FROM favouriteEpisodes WHERE id_user = ${req.query.user} AND favourite = 1)) THEN 1
		ELSE 0
	END AS efavourite
    FROM episode AS e, show AS s, story, user
    WHERE (s.show_id = e.id_show) AND (story_id = e.id_story) AND (user_id = ${req.query.user})
    ${zanrs ? ` AND (genre LIKE '%${zanrs}%')` : ''}
    ${kartot(parseInt(kartosanasID), parseInt(virzID), true)};`).all());
});

//Meklē visus seriālus datu bāzē
app.post('/seriali', (req, res) => {
    let zanrs;
    if (req.query.zanrs) zanrs = req.query.zanrs;

    res.send(db.prepare(`SELECT show_id, name, logo, start_date, end_date, genre1, genre2, genre3, theme1, theme2, theme3,
    CASE
        WHEN show_id IN (SELECT id_show FROM favouriteShows WHERE id_user = ${req.query.user} AND favourite = 1) THEN 1
        ELSE 0
        END AS sfavourite
    FROM show, time, genre, theme, user
        WHERE (time_id = id_time) AND (genre_id = id_genre) AND (theme_id = id_theme) AND (user_id = ${req.query.user})
        ${zanrs ? ` AND ((genre1 LIKE '%${zanrs}%') OR (genre2 LIKE '%${zanrs}%') OR (genre3 LIKE '%${zanrs}%'))` : ''};`).all());
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
        //db.exec(`UPDATE favouriteEpisodes SET favourite = ${f} WHERE id_episode = ${epizode} AND id_user = ${req.query.user}`);
        db.exec(`INSERT INTO favouriteEpisodes (id_user, id_episode, favourite) 
        VALUES(${req.query.user}, '${epizode}', '${f}')
        ON CONFLICT (id_user, id_episode) DO UPDATE
        SET favourite = excluded.favourite;`);
    } else {
        serials = req.query.serialaID;
        //db.exec(`UPDATE favouriteShows SET favourite = ${f} WHERE id_show = ${serials} AND id_user = ${req.query.user}`);
        db.exec(`INSERT INTO favouriteShows (id_user, id_show, favourite) 
        VALUES(${req.query.user}, '${serials}', '${f}')
        ON CONFLICT (id_user, id_show) DO UPDATE
        SET favourite = excluded.favourite;`);
    }
    res.send('throw');
});

app.post('/iestatijumi', (req, res) => {
    if (req.query.font) {
        db.exec(`INSERT INTO settings(id_user, font) VALUES('${req.query.user}','${req.query.font}')
            ON CONFLICT (id_user) DO UPDATE 
            SET font = excluded.font;`);
        res.send('throw');
    } else if (req.query.theme) {
        db.exec(`INSERT INTO settings(id_user, theme) VALUES('${req.query.user}','${req.query.theme}')
            ON CONFLICT (id_user) DO UPDATE 
            SET theme = excluded.theme;`);
        res.send('throw');
    } else {
        res.send(db.prepare(`SELECT * FROM settings WHERE id_user = ${req.query.user};`).all());
    }
});

import Database from 'better-sqlite3';
const db = new Database('./database/EpisodeDatabase.db');

//Ielogošanās
import crypto, { randomUUID } from 'crypto';

const sals = 'JNk29U77hKoDAn3jrMrXYiHOXelztFhh';

function parolesSifresana(parole) {
    const algoritms = 'aes-192-cbc';

    const atslega = crypto.scryptSync(parole, 'JNk29U77hKoDAn3jrMrXYiHOXelztFhh', 24);

    const sakumaVektors = Buffer.alloc(16, 0);

    const sifrs = crypto.createCipheriv(algoritms, atslega, sakumaVektors);

    let sifretaParole = sifrs.final('hex');

    return sifretaParole;
};

app.post('/login', (req, res) => {
    let parole = parolesSifresana(req.query.parole);
    res.send(db.prepare(`SELECT user_id FROM user WHERE password = '${parole}' AND username = '${req.query.lietotajVards}';`).all());
});

import cookieParser from 'cookie-parser';
app.use(cookieParser());

app.post('/cepumaVeidosana', (req, res) => {
    let user_id = req.query.user;
    let token = randomUUID();
    res.cookie('cepums', token, {httpOnly:true});
    db.exec(`UPDATE user SET token = '${token}' WHERE user_id = ${user_id};`);
    res.send('throw');
});
app.get('/cepumaSanemsana', (req, res) => {
    res.send(db.prepare(`SELECT user_id FROM user WHERE token = '${req.cookies.cepums}'`).all());
});

app.get('/dzestCepumu', (req, res) => {
    res.clearCookie('cepums');
    res.send('throw');
})

app.post('/register', (req, res) => {
    let parole = parolesSifresana(req.query.parole);
    res.send(db.prepare(`SELECT user_id FROM user WHERE username = '${req.query.lietotajVards}'`).all());
    if (db.prepare(`SELECT user_id FROM user WHERE username = '${req.query.lietotajVards}'`).all()[0] == undefined) {
        db.exec(`INSERT INTO user (username, password) VALUES('${req.query.lietotajVards}', '${parole}')
                ON CONFLICT DO NOTHING;`);
    }
});