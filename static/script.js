console.log('test')
//import Database from "./database/nodejs-sqlite/index.mjs";
//const db = new Database('EpisodeDatabase.db');


document.getElementById("btn-all").addEventListener("click", () =>{
    fetch('/clicked', {method: 'GET'})
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
        console.log(data[0].name);
        console.log('4');

        document.getElementById('output').innerHTML = "";
        document.getElementById('output').style.display = 'flex';
        document.getElementById('output').classList.remove('bg-danger');

        for (let i = 0; i < data.length; i++) {

        let div = document.createElement("div");
        document.getElementById("output").appendChild(div);
        div.classList.add('card', 'my-2')

        let img = document.createElement("img");
        img.classList.add('logo');
        div.appendChild(img);

        let div2  = document.createElement("div");
        div.appendChild(div2);
        div2.classList.add('card-body', 'p-2');


        let h5 = document.createElement('h5');
        h5.classList.add("card-title", "fs-4'");
        let text = document.createElement('p');
        text.classList.add("card-text", "fs-5");
        
        div2.appendChild(h5);
        div2.appendChild(text);

        img.setAttribute("src", data[i].logo);

        h5.innerHTML = `&quot;${data[i].ename}&quot;`
        text.innerHTML = 
        `
        Sezona-epizode: ${data[i].season}-${data[i].episode}<br>
        Raidīšanas datums: ${data[i].date}
        `;
        };
    })
    .catch(function(error) {
        console.log('5')
        console.log(error);
    });
})


document.getElementById("btn").addEventListener("click", () => {
    let textValue = document.getElementById('text-input').value;
    if (textValue == '') textValue = 'Pier Pressure';

   fetch(`/search?term=${textValue}`, {method: 'POST'})
    .then(function(response) {
        console.log('6')
        if(response.ok) {
            console.log('7')
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        document.getElementById('output').innerHTML = "";
        document.getElementById('output').style.display = 'flex';

        if (data[0] === undefined) {
            document.getElementById('output').classList.add('bg-danger');
            console.log('8')
            let div = document.createElement("div");
            document.getElementById("output").appendChild(div);
            div.classList.add('output-inside')
            let text = document.createElement('p');
            div.appendChild(text);
            text.id = 'text-output'
            text.innerHTML = `Nevarēju atrast epizodi!`
        } else {
            document.getElementById('output').classList.remove('bg-danger');
            console.log('9')
            for (let i = 0; i < data.length; i++) {

            let div = document.createElement("div");
            document.getElementById("output").appendChild(div);
            div.classList.add('card', 'my-2')

            let img = document.createElement("img");
            img.classList.add('logo');
            div.appendChild(img);

            let div2  = document.createElement("div");
            div.appendChild(div2);
            div2.classList.add('card-body', 'p-2');
            
            let h5 = document.createElement('h5');
            h5.classList.add("card-title", "fs-4'");
            let text = document.createElement('p');
            text.classList.add("card-text", "fs-5");
            
            div2.appendChild(h5);
            div2.appendChild(text);

            img.setAttribute("src", data[i].logo);

            h5.innerHTML = `&quot;${data[i].ename}&quot;`
            text.innerHTML = 
            `
            Sezona-epizode: ${data[i].season}-${data[i].episode}<br>
            Raidīšanas datums: ${data[i].date}
            `;
            };
        }
    })
    .catch(function(error) {
        console.log('10')
        console.log(error);
    });
});

//document.getElementById('genre').addEventListener('')