import * as Database from './node_modules/better-sqlite3/lib/database.js'
//const database = require('./node_modules/better-sqlite3')
const db = new Database('EpisodeDatabase.db');


//Ievietot datus
//const insert = db.prepare('INSERT INTO time (time_id, start_date, end_date) VALUES (?, ?, ?)');
//insert.run('2','1989-07-05 12:00:00.0000','1998-05-14 12:00:00.0000');

//Izvadīt datus
//console.log(db.prepare('SELECT * FROM time;').all());

document.querySelector("#btn").addEventListener("click", () =>{
    document.querySelector("#test-output").textContent = db.prepare('SELECT * FROM time;').all();
});

console.log("Imported");