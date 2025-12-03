//import Database from "./database/nodejs-sqlite/index.mjs";
//const db = new Database('EpisodeDatabase.db');


document.getElementById("btn-all").addEventListener("click", () =>{
    fetch('/clicked', {method: 'GET'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        document.getElementById('output').innerHTML = "";
        document.getElementById('output').style.display = 'flex';
        veidosana(data);
    })
    .catch(function(error) {
        console.log(error);
    });
})

document.getElementById("btn").addEventListener("click", () => {
    let textValue = document.getElementById('text-input').value;
    if (textValue == '') textValue = 'Pier Pressure';
    let genre = document.getElementById('inputGroupSelect02').value;
    let searchID = document.getElementById('inputGroupSelect01').value;

   fetch(`/search?term=${textValue}${genre != "Žanrs" ? '&genre='+genre : ''}&searchID=${searchID}`, {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        document.getElementById('output').innerHTML = "";
        document.getElementById('output').style.display = 'flex';

        if (data[0] === undefined) {
            neatrada();
        } else {
            veidosana(data);
        }
    })
    .catch(function(error) {
        console.log(error);
    });
});

function seriesEpisodes() {
    let textValue = this.alt;
    textValue = encodeURIComponent(textValue);

   fetch(`/search?showid=${textValue}&searchID=-1`, {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        document.getElementById('output').innerHTML = "";
        document.getElementById('output').style.display = 'flex';

        if (data[0] === undefined) {
            neatrada();
        } else {
            veidosana(data);
            serialaVeidosana(data, 0);
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

document.getElementById('btn-all-series').addEventListener('click', () => {
    fetch(`/show`, {method: 'GET'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        document.getElementById('output').innerHTML = "";
        document.getElementById('output').style.display = 'none';
        if (data[0] === undefined) {
            neatrada();
        } else {
            document.getElementById('series').innerHTML = '';
            for (let i = 0; i < data.length; i++) {
                serialaVeidosana(data, i);
            }
        }
    })
    .catch(function(error) {
        console.log(error);
    });
});

function neatrada() {
    document.getElementById('series').style.display = 'none';
    document.getElementById('output').classList.add('bg-danger');
    let div = document.createElement("div");
    document.getElementById("output").appendChild(div);
    div.classList.add('output-inside')
    let text = document.createElement('p');
    div.appendChild(text);
    text.id = 'text-output'
    text.innerHTML = `Nevarēju atrast epizodi!`
}

function serialaVeidosana(data, i) {
    div = document.getElementById('series');
    let img = document.createElement("img");
    img.setAttribute('alt', `${data[i].name}`);
    img.classList.add('logo');

    let div3 = document.createElement('div');
    div.appendChild(div3);

    div3.classList.add('card', 'm-2', 'bg-success-subtle');
    div3.appendChild(img);

    let div2  = document.createElement("div");
    div3.appendChild(div2);
    div2.classList.add('card-body', 'p-2');
                
    let h5 = document.createElement('h5');
    h5.classList.add("card-title", "fs-4'");
    let text = document.createElement('p');
    text.classList.add("card-text", "fs-5");
                
    div2.appendChild(h5);
    div2.appendChild(text);

    img.setAttribute("src", `${data[i].logo}`);

    h5.innerHTML = `${data[i].name}`
    text.innerHTML = 
    `
    Raidīšanas gadi: ${data[i].start_date} līdz ${data[i].end_date}<br>
    Žanri: ${data[i].genre1}${data[i].genre2 != null ? ', '+data[i].genre2.toLowerCase() : ''}${data[i].genre3 != null ? ', '+data[i].genre3.toLowerCase() : ''}<br>
    Tēmas: ${data[i].theme1}, ${data[i].theme2.toLowerCase()}, ${data[i].theme3.toLowerCase()}
    `;
    div3.style.display = 'flex';
    div.style.display = 'flex';
    img.addEventListener("click", (seriesEpisodes));
}

function veidosana(data, serials) {
    document.getElementById('series').innerHTML = '';
    document.getElementById('series').style.display = 'none';
    document.getElementById('output').classList.remove('bg-danger');
    for (let i = 0; i < data.length; i++) {

    let div = document.createElement("div");
    document.getElementById("output").appendChild(div);
    div.classList.add('card', 'm-2')

    let img = document.createElement("img");
    img.setAttribute('alt', `${data[i].name}`)
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
    Raidīšanas datums: ${data[i].date}<br>
    Žanrs: ${data[i].genre}<br>
    Stāsta elementi: ${data[i].element1}${data[i].element2 != null ? ', '+data[i].element2.toLowerCase() : ''}${data[i].element3 != null ? ', '+data[i].element3.toLowerCase() : ''}
    `;
    img.addEventListener("click", (seriesEpisodes));
    };
}

function resizePageMobile(){
    let a = document.getElementById('input-group');

    if (window.innerWidth <= 900) {
        a.classList.add('input-group-sm');
    }else{ 
        a.classList.remove('input-group-sm');
    }

}
resizePageMobile();
window.addEventListener('resize',resizePageMobile);