console.log('test')
//import Database from "./database/nodejs-sqlite/index.mjs";
//const db = new Database('EpisodeDatabase.db');

document.querySelector("#btn").addEventListener("click", () =>{
    //document.querySelector("#test-output").textContent = db.prepare('SELECT * FROM time;').all();
    fetch('/clicked', {method: 'POST'})
    .then(function(response) {
        console.log('1')
        if(response.ok) {
            console.log('2')
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        console.log('3');
        console.log(data.name)
        console.log('4');
        document.getElementById('test-output').innerHTML = 
        `
        Nosaukums: ${data.name}<br>
        Sezona: ${data.season} Epizode: ${data.episode}<br>
        Raidīšanas datums: ${data.date}
        `;
    })
    .catch(function(error) {
        console.log('5')
        console.log(error);
    });
})
