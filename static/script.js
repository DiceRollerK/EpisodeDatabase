//Ja vērtība ir 'true' tad būs izvadītas dažādas atkļūdošanas vērtības
let debug = false;
//outputData saglabā datus, kurus var izmantot visā dokumentā, tas tiek izmantots lapas maiņas funkcijā
let outputData
//saglabā kura lapa ir izvadīta, sākot ar 0
let page = 0;

//Izvada visas epizodes kas ir datu bāzē
document.getElementById("btn-all").addEventListener("click", () =>{
    if(debug) console.log('1')
    //Saņem vērtību sortID no izvēlnes 'Pēc kā kārtot'
    let sortID = document.getElementById('inputGroupSelect03').value;
    //Saņem vērtību no izvēlnes ar bultiņu, vērtība var būt 0 vai 1
    let dirID = document.getElementById('inputGroupSelect04').value;

    //Aizsūt pieprasījumu uz adresi clicked, kas izvada visas epizodes
    //sortID pasaka kā vērtības tiek kārtotas 
    //dirID saka vai vērtības būt kārtotas dilstoši vai augoši
    fetch(`/clicked?sortID=${sortID}&dirID=${dirID}`, {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        //Paslēpj kasti ar seriāliem jo tie nebūs izvadīti
        document.getElementById('series').innerHTML = '';
        document.getElementById('series').style.display = 'none';
        //Ievieto vērtības outputData masīvā, lai tās vērtības varētu vēlāk izmantot lapu maiņas funkcija
        outputData = data;
        page = 0;
        //Izdzēš iepriekšējās vērtības kastē ar epizodēm un padara to redzamu
        document.getElementById('output').innerHTML = "";
        document.getElementById('output').style.display = 'flex';
        //Izvada tikai pirmās 6 vērtības, jo tik daudz ir vienā lapā
        if (data.length > (((page+1)*6))) {
            for (let i = page*6; i < (page+1)*6; i++) {
                veidosana(data, i);
            }
        }
        //Pārbauda vai bultiņām jāizskatās uzspiežamām
        arrowCheck();
    })
    .catch(function(error) {
        console.log(error);
    });
})

//Atļauj meklēt uzspiežot gan meklēšanas pogu, gan uzspiežot uz klaviatūras 'enter'
document.getElementById("btn").addEventListener("click", search);
document.getElementById("text-input").addEventListener("keydown", function(e) {
    if (e.key === 'Enter') {
        search();
    }
});

//Izvada visas epizodes un seriālus kurus lietotājs ir atzīmējis kā "mīļotus"
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
        //Paslēpj un idzēš vērtības kastē ar seriāliem un kastē ar epizodēm jo tie būs atklāti kad veidoti
        document.getElementById('output').style.display = 'none';
        document.getElementById('output').innerHTML = "";
        document.getElementById('series').innerHTML = '';
        document.getElementById('series').style.display = 'none';

        //Pārbauda vai datu masīvā vispār ir vērtības
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
        //Pārbauda vai bultiņām jāizskatās uzspiežamām
    arrowCheck();
    })
    .catch(function(error) {
        console.log(error);
    });
});

//Meklēšanas funkcija
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
        //Paslēpj un idzēš vērtības kastē ar seriāliem, jo tos nevar atrast un izdzēš vērtības kastē ar epizodēm, lai tie netraucētu
        document.getElementById('output').innerHTML = "";
        document.getElementById('series').innerHTML = '';
        document.getElementById('series').style.display = 'none';

        //Pārbauda vai datu masīvā vispār ir vērtības
        if (data[0] === undefined) {
            neatrada();
        } else {
            outputData = data;
            if(debug) console.log(data);
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
            //Pārbauda vai bultiņām jāizskatās uzspiežamām
            arrowCheck();
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

//Izvada kļūdu ja nevarēja atrast jebkādu epizodi datu bāzē
function neatrada() {
    //Paslēpj un idzēš vērtības kastē ar seriāliem jo tos neizvad
    document.getElementById('series').style.display = 'none';
    document.getElementById('output').style.display = 'flex';
    //Iedod klasi kas krāso fonu kastei sarkanu, kas nozīmē kļūda
    document.getElementById('output').classList.add('bg-danger');
    //teksta kaste
    let div = document.createElement("div");
    document.getElementById("output").appendChild(div);
    div.classList.add('output-inside')
    //teksts
    let text = document.createElement('p');
    div.appendChild(text);
    text.id = 'text-output'
    text.innerHTML = `Nevarēju atrast!`
}

//Izvada visus seriālus kas ir datu bāzē
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
        //outputData tiek iztīrīts, jo mainīt lapas nav iespējams pēc šīs funkcijas
        outputData = [];
        page = 0;
        //Paslēpj un idzēš vērtības kastē ar epizodēm jo tie nebūs izvadīti
        document.getElementById('output').innerHTML = "";
        document.getElementById('output').style.display = 'none';

        //Pārbauda vai datu masīvā vispār ir vērtības
        if (data[0] === undefined) {
            neatrada();
        } else {
            document.getElementById('series').innerHTML = '';
            for (let i = 0; i < data.length; i++) {
                serialaVeidosana(data, i);
            }
        }
        //Pārbauda vai bultiņām jāizskatās uzspiežamām
        arrowCheck();
    })
    .catch(function(error) {
        console.log(error);
    });
}

//Veido seriālu kartiņas
function serialaVeidosana(data, i) {
    //Šis divs ir kaste kas iekļauj visus seriālus
    div = document.getElementById('series');
    let img = document.createElement("img");
    //Alt vērtība ir vēlāk izmantota lai atpazīt kuram seriālam pieder bilde
    img.setAttribute('alt', `${data[i].name}`);
    img.classList.add('logo');
    if (darkmode(1)) {
        img.style.backgroundColor = '#00000010';
    } else {
        img.style.backgroundColor = '#ffffff90';
    }

    //Zvaigzne kas atzīmē mīļotos seriālus
    let star = document.createElement('p');
    if(data[i].favourite == 1) {
        star.classList.add('fas', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    } else {
        star.classList.add('far', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    }
    star.setAttribute('data-show', data[i].show_id);

    //Veido seriāla karti
    let div3 = document.createElement('div');
    div.appendChild(div3);

    div3.appendChild(star)

    //Kartes noformējums
    div3.classList.add('card', 'm-2', 'bg-success-subtle');
    div3.appendChild(img);

    let div2  = document.createElement("div");
    div3.appendChild(div2);
    div2.classList.add('card-body', 'p-2');
    
    //Teksta stils
    let h5 = document.createElement('h5');
    h5.classList.add("card-title", "fs-4'");
    let text = document.createElement('p');
    text.classList.add("card-text", "fs-5");
                
    div2.appendChild(h5);
    div2.appendChild(text);

    //Ievieto informāciju kartē
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

    //Pievieno funkcijas elementiem pēc to izveidošanas
    star.addEventListener('click', (favourite));
    img.addEventListener("click", (seriesEpisodes));
}

//Izvada visas epizodes kas ir seriālam uz kura uzspiež
function seriesEpisodes() {
    if(debug) console.log('3')

    let textValue = this.alt;
    //Seriālam 'Love, Death & Robots' bija kļūda, kas tika izlabota šifrējot to vērtību izmantojot šo funkciju
    textValue = encodeURIComponent(textValue);

   fetch(`/search?showid=${textValue}&searchID=-1`, {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        }
        throw new Error('Request failed.');
    })
    .then(function(data) {
        //Izdzēš iepriekšējās vērtības lai tās netraucētu
        document.getElementById('output').innerHTML = "";
        document.getElementById('series').innerHTML = '';
        
        //Pārbauda vai datu masīvā vispār ir vērtības
        if (data[0] === undefined) {
            neatrada();
        } else {
            outputData = data;
            page = 0;
            document.getElementById('series').innerHTML = '';
            //Ja datu masīva garums ir lielāks par 6, tad izvad pirmās 6 vērtības, citādāk izvada visas vērtības
            if (data.length > 6) {
                for (let i = 0; i < 6; i++) {
                    veidosana(data, i);
                }
            } else {
                for (let i = 0; i < data.length; i++) {
                    veidosana(data, i);
                }
            }
            //Izvad vienu seriāla karti, izmantojot 0 vērtību, jo seriāla vērtības no datu masīva vienmēr būs vienādas
            serialaVeidosana(data, 0);
            //Pārbauda vai bultiņām jāizskatās uzspiežamām
            arrowCheck();
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

//Izveido epizodes kartiņas
function veidosana(data, i) {
    //Šis divs ir kaste kas iekļauj visas epizodes
    document.getElementById('output').style.display = 'flex';
    document.getElementById('output').classList.remove('bg-danger');

    //Zvaigzne kas atzīmē mīļotos seriālus
    let star = document.createElement('p');
    if(data[i].efavourite == 1) {
        star.classList.add('fas', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    } else {
        star.classList.add('far', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    }
    star.setAttribute('data-episode', data[i].episode_id);

    //Veido epizodes karti
    let div = document.createElement("div");
    document.getElementById("output").appendChild(div);
    div.classList.add('card', 'm-2')

    div.appendChild(star);

    let img = document.createElement("img");
    //Alt vērtība ir vēlāk izmantota lai atpazīt kuram seriālam pieder bilde
    img.setAttribute('alt', `${data[i].name}`)
    img.classList.add('logo');
    div.appendChild(img);
    if (darkmode(1)) {
        img.style.backgroundColor = '#00000010';
    } else {
        img.style.backgroundColor = '#ffffff90';
    }

    //Kartes noformējums
    let div2  = document.createElement("div");
    div.appendChild(div2);
    div2.classList.add('card-body', 'p-2');
    
    //Teksta stils
    let h5 = document.createElement('h5');
    h5.classList.add("card-title", "fs-4'");
    let text = document.createElement('p');
    text.classList.add("card-text", "fs-5");
    div2.appendChild(h5);
    div2.appendChild(text);

    //Ievieto informāciju kartē
    img.setAttribute("src", data[i].logo);
    h5.innerHTML = `&quot;${data[i].ename}&quot;`
    text.innerHTML = 
    `
    Sezona-epizode: ${data[i].season}-${data[i].episode}<br>
    Raidīšanas datums: ${data[i].date}<br>
    Žanrs: ${data[i].genre}<br>
    Stāsta elementi: ${data[i].element1}${data[i].element2 != null ? ', '+data[i].element2.toLowerCase() : ''}${data[i].element3 != null ? ', '+data[i].element3.toLowerCase() : ''}
    `;
    //Pievieno funkcijas elementiem pēc to izveidošanas
    star.addEventListener('click', (favourite));
    img.addEventListener("click", (seriesEpisodes));
}

//Padara epizodi vai seriālu par mīļāko, lai to varētu ātrāk atrast
function favourite() {
    let f;
    //Ja klase ir fas, tad seriāls vai epizode jau ir atzīmēti kā mīļoti, citādāk tie nav atzīmēti kā mīļoti
    if (this.classList.contains('fas')) {
        f = 1;
        if (this.dataset.episode) {
            if (debug) console.log('ep fav 0');
            //Maina vērtību outputData, lai mainot lapu saglabājās vērtību aizejot atpakaļ
            for (let i in outputData) {
                if (outputData[i].episode_id == this.dataset.episode) {
                    outputData[i].efavourite = 0;
                }
            }
        } else {
            if (debug) console.log('show fav 0');
            //Maina vērtību outputData, lai mainot lapu saglabājās vērtību aizejot atpakaļ
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
            //Maina vērtību outputData, lai mainot lapu saglabājās vērtību aizejot atpakaļ
            for (let i in outputData) {
                if (outputData[i].episode_id == this.dataset.episode) {
                    outputData[i].efavourite = 1;
                }
            }
        } else {
            if (debug) console.log('show fav 1');
            //Maina vērtību outputData, lai mainot lapu saglabājās vērtību aizejot atpakaļ
            for (let i in outputData) {
                if (outputData[i].show_id == this.dataset.episode) {
                    outputData[i].favourite = 1;
                    break;
                }
            }
        }
    }
    //Pārslēdz pilnu zvaigzni ar nepilnu zvaigzni un otrādi
    this.classList.toggle('fas');
    this.classList.toggle('far');
    //Pārbauda vai tiek mīļota/nemīļota epizode vai seriāls
    if(this.dataset.episode) {
        fetch(`/favourite?favourite=${f}&epid=${this.dataset.episode}`, {method: 'POST'})
            .then(function(response) {
        if(response.ok) {
            return;
        }
        throw new Error('Request failed.');
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
        .catch(function(error) {
            console.log(error);
        });
    }
}

//Pārbauda vai bultiņām jāizskatās uzspiežamām
function arrowCheck() {
    //Nulletajā lapā kreisā bultiņa nekad neizskatīsies spiežama, bet citās lapās vislai izskatīsies spiežama
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
    //Ja nākošajā lapā atrodas vismas viena epizode, tad labā bultiņa izskatās uzspiežama
    if ((outputData.length - (((page+1)*6))) > 0) {
        //for cikls saņem abas bultiņas augšā un lejā un maina to stilu
        for (let i = 0; i < 2; i++) {
            right = document.getElementsByClassName('fa-caret-square-right')[i];
            right.classList.remove('far');
            right.classList.add('fas');
            right.style.cursor = 'pointer';
        }
    } else {
        //for cikls saņem abas bultiņas augšā un lejā un maina to stilu
        for (let i = 0; i < 2; i++) {
            right = document.getElementsByClassName('fa-caret-square-right')[i];
            right.classList.remove('fas');
            right.classList.add('far');
            right.style.cursor = 'initial';
        }
    }
}

//Nodrošina to kā tiek izvadītas citas lapas uzspiežot uz bultiņām
function pageChange(virz) {
    if (debug) console.log(page);
    if (debug) console.log((outputData.length - (((page+1)*6))));
    //Pārbauda kurā virzienā rāda poga
    if (virz == 'r'){
        //Ja nākošā lapā ir vēl 6 vai vairāk epizodes, tad tiek izvadītas 6 epizodes, citādi ja nākošā lapā epizožu skaits ir mazāk par 6, tad izvada visas palikušās epizodes un ne vairāk, ja vairs nav epizožu tad nekas nenotiek
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
    } else if (virz == 'l') {
        //Ja pagaišās lapas sākuma ID nav mazāks par 0, tad izvada 6 iepriekšējās epizodes
        if ((page-1)*6  >= 0) {
            page--;
            document.getElementById('output').innerHTML = '';
        for (let i = page*6; i < (page+1)*6; i++) {
            veidosana(outputData, i);
        }
        }
    }
    //Pārbauda vai bultiņām jāizskatās uzspiežamām
    arrowCheck();
}
//Uzreiz izvad visus seriālus datu bāzē
allSeries();

//Maina meklēšanas elementus lai tie būtu labāk redzami uz maziem un telefona ekrāniem
function smallScreen(){
    let a = document.getElementById('input-group');
    let a2 = document.getElementById('input-group2');

    //input-group-sm ir mazāka versija input-group stila klasei
    if (window.innerWidth <= 900) {
        a.classList.add('input-group-sm');
        a2.classList.add('input-group-sm');
    }else{ 
        a.classList.remove('input-group-sm');
        a2.classList.remove('input-group-sm');
    }

    //Maina izveļņu izvadi kolonnās, jo tā paliek iespējams tos spiest
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
//Kad mainās ekrāna izmērs, sākās ekrāna lieluma maiņas funkcija
window.addEventListener('resize', smallScreen);

function darkmode(reas) {
    //Maina tumšo un gaišo režīmu
    let dark = (document.getElementById('darkmode').dataset.dark == "0")
    if (reas == '0') {
        if (dark) {
            document.getElementById('darkmode').innerHTML = 'Gaišais režīms';
            document.getElementById('darkmode').dataset.dark = '1';
            document.getElementById('html').setAttribute('data-bs-theme','dark'); 
            document.getElementById('navbar').style.backgroundColor = '#863707';
            document.getElementById('body').style.backgroundColor = '#066efd';
            document.getElementById('series').style.backgroundColor = '#363'
            document.getElementById('output').style.backgroundColor = '#363'
            for (let i = 0; i < document.getElementsByClassName('logo').length; i++) {
                document.getElementsByClassName('logo')[i].style.background = '#ffffff90';
            }
        } else {
            document.getElementById('darkmode').innerHTML = 'Tumšais režīms'
            document.getElementById('darkmode').dataset.dark = '0';
            document.getElementById('html').removeAttribute('data-bs-theme','dark');
            document.getElementById('navbar').style.backgroundColor = '#fd7e14';
            document.getElementById('body').style.backgroundColor = '#0dcaf0';
            document.getElementById('series').style.backgroundColor = '#7c7'
            document.getElementById('output').style.backgroundColor = '#7c7'
            for (let i = 0; i < document.getElementsByClassName('logo').length; i++) {
                document.getElementsByClassName('logo')[i].style.background = '#00000010';
            }
        }
    //Pārbauda vai tagad ir gaišais vai tumšais režīms
    } else if (reas == '1') {
        return (dark); //true = tumšais režīms, false = gaišais režīms
    }
}

darkmode(0);