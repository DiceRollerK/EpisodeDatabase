console.log('test')
//import Database from "./database/nodejs-sqlite/index.mjs";
//const db = new Database('EpisodeDatabase.db');

var img = document.createElement("img");
    img.classList.add('logo');

    var text = document.createElement('p');
    text.id = 'text-output'
    

    document.getElementById("output").appendChild(img);
    document.getElementById("output").appendChild(text);


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
        console.log(data.name);
        console.log('4');

        img.setAttribute("src", data.logo);

        text.innerHTML = 
        `
        Nosaukums: ${data.name}<br>
        Sezona-epizode: ${data.season}-${data.episode}<br>
        Raidīšanas datums: ${data.date}
        `;
        /*
        document.getElementById('text-output').innerHTML = 
        `
        Nosaukums: ${data.name}<br>
        Sezona-epizode: ${data.season}-${data.episode}<br>
        Raidīšanas datums: ${data.date}
        `;
        */
    })
    .catch(function(error) {
        console.log('5')
        console.log(error);
    });
})
