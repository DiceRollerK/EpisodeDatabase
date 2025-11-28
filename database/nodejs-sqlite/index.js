


//Ievietot datus
//const insert = db.prepare('INSERT INTO time (time_id, start_date, end_date) VALUES (?, ?, ?)');
//insert.run('2','1989-07-05 12:00:00.0000','1998-05-14 12:00:00.0000');

//Izvadīt datus
//console.log(db.prepare('SELECT * FROM time;').all());

/*
import http from 'http';
import { URL } from 'url';
import querystring, { stringify } from'querystring';
*/

import express from'express';
import path from'path';
const app = express();
const port = 3000;

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);
console.log(__filename);


console.log(path.join(__dirname,'../../static'));
app.use(express.static(path.join(__dirname,'../../static')));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

app.post('/clicked', (req, res) => {
    const click = {clickTime: new Date()};
    console.log(click);
    /*
    console.log(db);

    db.collection('clicks').save(click, (err, result) => {
        if (err) {
        return console.log(err);
        }
        console.log('click added to db');
        res.sendStatus(201);
    });
    */
    console.log(db.prepare('SELECT * FROM episode;').all()[1]);
    res.send(db.prepare('SELECT * FROM episode;').all()[1]);
});

import Database from 'better-sqlite3';
const db = new Database('EpisodeDatabase.db');

console.log("Done");