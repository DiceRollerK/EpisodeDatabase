//import Database from "./database/nodejs-sqlite/index.mjs";
//const db = new Database('EpisodeDatabase.db');
let debug = false;
let outputData;
let page = 0;


document.getElementById("btn-all").addEventListener("click", () =>{
    if(debug) console.log('1')
    let sortID = document.getElementById('inputGroupSelect03').value;
    let dirID = document.getElementById('inputGroupSelect04').value;

    fetch(`/clicked?sortID=${sortID}&dirID=${dirID}`, {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        document.getElementById('series').innerHTML = '';
        document.getElementById('series').style.display = 'none';
        outputData = data;
        page = 0;
        document.getElementById('output').innerHTML = "";
        document.getElementById('output').style.display = 'flex';
        if (data.length > (((page+1)*6))) {
            for (let i = page*6; i < (page+1)*6; i++) {
                veidosana(data, i);
            }
        }
        arrowCheck();
    })
    .catch(function(error) {
        console.log(error);
    });
})

document.getElementById("btn").addEventListener("click", search);
document.getElementById("text-input").addEventListener("keydown", function(e) {
    if(debug) console.log('2.1')

    if (e.key === 'Enter') {
        search();
    }
});

document.getElementById('btn-favourites').addEventListener('click', () => {
    if(debug) console.log('4');
    let sortID = document.getElementById('inputGroupSelect03').value;
    let dirID = document.getElementById('inputGroupSelect04').value;

    fetch(`/search?searchID=-2&sortID=${sortID}&dirID=${dirID}`, {method: 'POST'})
    .then(function(response) {
        if(debug) console.log('5');

        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        outputData = [];
        document.getElementById('output').style.display = 'none';
        document.getElementById('output').innerHTML = "";
        document.getElementById('series').innerHTML = '';
        document.getElementById('series').style.display = 'none';

        if (data[0] === undefined) {
            neatrada();
        } else {
            let series = [];
            let episodes = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].efavourite == 1) {
                    episodes.push(data[i]);
                }
                if (data[i].favourite == 1) {
                    document.getElementById('series').style.display = 'flex';
                    series.push(data[i]);
                }
            }
            outputData = episodes;
            page = 0;
            document.getElementById('series').innerHTML = '';
            let showids = [];
            if (episodes.length > 6) {
                for (let i = 0; i < 6; i++) {
                    veidosana(episodes, i);
                }
            } else {
                for (let i = 0; i < episodes.length; i++) {
                    veidosana(episodes, i);
                }
            }
            if (series.length > 6) {
                for (let i = 0; i < series.length; i++) {
                    if (!showids.includes(series[i].show_id)) {
                        showids.push(series[i].show_id);
                        serialaVeidosana(series, i);
                    }
                }
            } else {
                for (let i = 0; i < series.length; i++) {
                    if (!showids.includes(series[i].show_id)) {
                        showids.push(series[i].show_id);
                        serialaVeidosana(series, i);
                    }
                }
            }
        }
    arrowCheck();
    })
    .catch(function(error) {
        console.log(error);
    });
});

function search() {
    if(debug) console.log('2')

    let textValue = document.getElementById('text-input').value;
    if (textValue == '') textValue = 'Pier Pressure';
    let genre = document.getElementById('inputGroupSelect02').value;
    let searchID = document.getElementById('inputGroupSelect01').value;
    let sortID = document.getElementById('inputGroupSelect03').value;
    let dirID = document.getElementById('inputGroupSelect04').value;

   fetch(`/search?term=${textValue}${genre != "Žanrs" ? '&genre='+genre : ''}&searchID=${searchID}&sortID=${sortID}&dirID=${dirID}`, {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        document.getElementById('output').innerHTML = "";
        document.getElementById('series').innerHTML = '';
        document.getElementById('series').style.display = 'none';

        if (data[0] === undefined) {
            neatrada();
        } else {
            outputData = data;
            page = 0;
            if (data.length > 6) {
                for (let i = 0; i < 6; i++) {
                    veidosana(data, i);
                }
            } else {
                for (let i = 0; i < data.length; i++) {
                    veidosana(data, i);
                }
            }
            arrowCheck();
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

function neatrada() {
    document.getElementById('series').style.display = 'none';
    document.getElementById('output').style.display = 'flex';
    document.getElementById('output').classList.add('bg-danger');
    let div = document.createElement("div");
    document.getElementById("output").appendChild(div);
    div.classList.add('output-inside')
    let text = document.createElement('p');
    div.appendChild(text);
    text.id = 'text-output'
    text.innerHTML = `Nevarēju atrast!`
}

document.getElementById('btn-all-series').addEventListener('click', (allSeries))

function allSeries() {
    fetch(`/show`, {method: 'GET'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        outputData = [];
        page = 0;
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
        arrowCheck();
    })
    .catch(function(error) {
        console.log(error);
    });
}

function serialaVeidosana(data, i) {
    div = document.getElementById('series');
    let img = document.createElement("img");
    img.setAttribute('alt', `${data[i].name}`);
    img.classList.add('logo');

    let star = document.createElement('p');
    if(data[i].favourite == 1) {
        star.classList.add('fas', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    } else {
        star.classList.add('far', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    }
    star.setAttribute('data-show', data[i].show_id);

    let div3 = document.createElement('div');
    div.appendChild(div3);

    div3.appendChild(star)

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

    star.addEventListener('click', (favourite));
    img.addEventListener("click", (seriesEpisodes));
}

function seriesEpisodes() {
    if(debug) console.log('3')

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
        document.getElementById('series').innerHTML = '';
        document.getElementById('series').style.display = 'none';

        if (data[0] === undefined) {
            neatrada();
        } else {
            outputData = data;
            page = 0;
            document.getElementById('series').innerHTML = '';
            if (data.length > 6) {
                for (let i = 0; i < 6; i++) {
                    veidosana(data, i);
                }
            } else {
                for (let i = 0; i < data.length; i++) {
                    veidosana(data, i);
                }
            }
            serialaVeidosana(data, 0);
            arrowCheck();
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

function veidosana(data, i) {
    document.getElementById('output').style.display = 'flex';
    document.getElementById('output').classList.remove('bg-danger');

    let star = document.createElement('p');
    if(data[i].efavourite == 1) {
        star.classList.add('fas', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    } else {
        star.classList.add('far', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    }
    star.setAttribute('data-episode', data[i].episode_id);

    let div = document.createElement("div");
    document.getElementById("output").appendChild(div);
    div.classList.add('card', 'm-2')

    div.appendChild(star);

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
    star.addEventListener('click', (favourite));
    img.addEventListener("click", (seriesEpisodes));
}

function favourite() {
    let f;
    if (this.classList.contains('fas')) {
        f = 1;
        if (this.dataset.episode) {
            if (debug) console.log('ep fav 0');
            for (let i in outputData) {
                if (outputData[i].episode_id == this.dataset.episode) {
                    outputData[i].efavourite = 0;
                }
            }
        } else {
            if (debug) console.log('show fav 0');
            for (let i in outputData) {
                if (outputData[i].show_id == this.dataset.episode) {
                    outputData[i].favourite = 0;
                }
            }
        }
    } else {
        f = 0;
        if (this.dataset.episode) {
            if (debug) console.log('ep fav 1');
            for (let i in outputData) {
                if (outputData[i].episode_id == this.dataset.episode) {
                    outputData[i].efavourite = 1;
                }
            }
        } else {
            if (debug) console.log('show fav 1');
            for (let i in outputData) {
                if (outputData[i].show_id == this.dataset.episode) {
                    outputData[i].favourite = 1;
                    break;
                }
            }
        }
    }
    this.classList.toggle('fas');
    this.classList.toggle('far');
    if(this.dataset.episode) {
        fetch(`/favourite?favourite=${f}&epid=${this.dataset.episode}`, {method: 'POST'})
            .then(function(response) {
        if(response.ok) {
            return;
        }
        throw new Error('Request failed.');
        })
        .then(function(data) {
        })
        .catch(function(error) {
            console.log(error);
        });
    } else {
        fetch(`/favourite?favourite=${f}&showid=${this.dataset.show}`, {method: 'POST'})
            .then(function(response) {
        if(response.ok) {
            return;
        }
        throw new Error('Request failed.');
        })
        .then(function(data) {
        })
        .catch(function(error) {
            console.log(error);
        });
    }
}

function smallScreen(){
    let a = document.getElementById('input-group');
    let a2 = document.getElementById('input-group2');

    if (window.innerWidth <= 900) {
        a.classList.add('input-group-sm');
        a2.classList.add('input-group-sm');
    }else{ 
        a.classList.remove('input-group-sm');
        a2.classList.remove('input-group-sm');
    }

    if(window.innerWidth <= 600) {
        a2.classList.remove('input-group');
        a2.classList.remove('input-group-sm');
        a2.classList.add('d-flex')
        a2.classList.add('flex-column')
    } else {
        a2.classList.add('input-group');
        a2.classList.remove('d-flex')
        a2.classList.remove('flex-column');
    }
}
smallScreen();
window.addEventListener('resize', smallScreen);

function arrowCheck() {
    if (page == 0) {
        for (let i = 0; i < 2; i++) {
            left = document.getElementsByClassName('fa-caret-square-left')[i];
            left.classList.remove('fas');
            left.classList.add('far');
            left.style.cursor = 'initial';
        }
    } else {
        for (let i = 0; i < 2; i++) {
            left = document.getElementsByClassName('fa-caret-square-left')[i];
            left.classList.remove('far');
            left.classList.add('fas');
            left.style.cursor = 'pointer';
        }
    }
    if ((outputData.length - (((page+1)*6))) > 0) {
        for (let i = 0; i < 2; i++) {
            right = document.getElementsByClassName('fa-caret-square-right')[i];
            right.classList.remove('far');
            right.classList.add('fas');
            right.style.cursor = 'pointer';
        }
    } else {
        for (let i = 0; i < 2; i++) {
            right = document.getElementsByClassName('fa-caret-square-right')[i];
            right.classList.remove('fas');
            right.classList.add('far');
            right.style.cursor = 'initial';
        }
    }
}

function pageChange(virz) {
    if (debug) console.log(page);
    if (debug) console.log((outputData.length - (((page+1)*6))));
    if (virz == 'r'){
        if ((outputData.length - (((page+1)*6))) >= 6) {
            page++;
            document.getElementById('output').innerHTML = '';
        for (let i = page*6; i < (page+1)*6; i++) {
            veidosana(outputData, i);
        }
        } else if (((outputData.length - (((page+1)*6))) < 6) && (outputData.length - (((page+1)*6))) > 0) {
            page++;
            document.getElementById('output').innerHTML = '';
            for (let i = page*6; i < outputData.length; i++) {
                veidosana(outputData, i);
            }
        }
    } 
    if (virz == 'l') {
        if ((page-1)*6  >= 0) {
            page--;
            document.getElementById('output').innerHTML = '';
        for (let i = page*6; i < (page+1)*6; i++) {
            veidosana(outputData, i);
        }
        }
    }
    arrowCheck();
}

allSeries();