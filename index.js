


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


console.log(path.join(__dirname,'static'));
app.use(express.static(path.join(__dirname,'static')));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    const searchTerm = req.query.term;
    let searchValue = '';

    if (!searchTerm) {
        searchValue = 'Pier Pressure'
    } else {
        searchValue = searchTerm;
    }
    //console.log(db.prepare(`SELECT *, e.name AS ename FROM episode AS e, show AS s WHERE (s.show_id = e.id_show)`).all());
    res.send(db.prepare(`SELECT *, e.name AS ename FROM episode AS e, show AS s WHERE (s.show_id = e.id_show) AND (ename LIKE '%${searchValue}%' OR s.name LIKE '%${searchValue}%');`).all())
})



app.get('/clicked', (req, res) => {
    const click = {clickTime: new Date()};
    console.log(click);
    console.log(req.get);
    
    //let search = document.querySelector("#text-input").value
    //console.log(db.prepare(`SELECT *, e.name AS ename FROM episode AS e, show AS s WHERE s.show_id = e.id_show WHERE ename LIKE '%${search}%'`).all());
    //console.log(db.prepare(`SELECT *, e.name AS ename FROM episode AS e, show AS s WHERE s.show_id = e.id_show`).all());
    //console.log(db.prepare('SELECT * FROM episode, show;').all()[1]);
    res.send(db.prepare(`SELECT *, e.name AS ename FROM episode AS e, show AS s WHERE (s.show_id = e.id_show);`).all());
});


import Database from 'better-sqlite3';
const db = new Database('./database/nodejs-sqlite/EpisodeDatabase.db');

console.log("Done");