//Ja vērtība ir 'true' tad būs izvadītas dažādas atkļūdošanas vērtības
let debug = false;
//izvadesDati saglabā datus, kurus var izmantot visā dokumentā, tas tiek izmantots lapas maiņas funkcijā
let izvadesDati
//saglabā kura lapa ir izvadīta, sākot ar 0
let lapa = 0;
let tumss = false;

//Izvada visas epizodes kas ir datu bāzē
document.getElementById("poga-visi-epizodes").addEventListener("click", () =>{
    if(debug) console.log('1')
    //Saņem vērtību kartosanasID no izvēlnes 'Pēc kā kārtot'
    let kartosanasID = document.getElementById('ievadaGrupasIzvele03').value;
    //Saņem vērtību no izvēlnes ar bultiņu, vērtība var būt 0 vai 1
    let virzID = document.getElementById('ievadaGrupasIzvele04').value;

    let zanrs = document.getElementById('ievadaGrupasIzvele02').value;

    //Aizsūt pieprasījumu uz adresi clicked, kas izvada visas epizodes
    //kartosanasID pasaka kā vērtības tiek kārtotas 
    //virzID saka vai vērtības būt kārtotas dilstoši vai augoši
    fetch(`/clicked?kartosanasID=${kartosanasID}&virzID=${virzID}${zanrs != "Žanrs" ? '&zanrs='+zanrs : ''}`, {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        //Paslēpj kasti ar seriāliem jo tie nebūs izvadīti
        document.getElementById('serialuIzvade').innerHTML = '';
        document.getElementById('serialuIzvade').style.display = 'none';
        //Ievieto vērtības izvadesDati masīvā, lai tās vērtības varētu vēlāk izmantot lapu maiņas funkcija
        izvadesDati = data;
        lapa = 0;
        //Izdzēš iepriekšējās vērtības kastē ar epizodēm un padara to redzamu
        document.getElementById('epizozuIzvade').innerHTML = "";
        document.getElementById('epizozuIzvade').style.display = 'flex';
        //Izvada tikai pirmās 6 vērtības, jo tik daudz ir vienā lapā
        if (data.length > 6) {
            for (let i = 0; i < 6; i++) {
                epizodesVeidosana(data, i);
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                epizodesVeidosana(data, i);
            }
        }
        //Pārbauda vai bultiņām jāizskatās uzspiežamām
        bultuParbauds();
    })
    .catch(function(error) {
        console.log(error);
    });
})

//Atļauj meklēt uzspiežot gan meklēšanas pogu, gan uzspiežot uz klaviatūras 'enter'
document.getElementById("poga-meklet").addEventListener("click", meklet);
document.getElementById("teksta-ievade").addEventListener("keydown", function(e) {
    if (e.key === 'Enter') {
        meklet();
    }
});

//Izvada visas epizodes un seriālus kurus lietotājs ir atzīmējis kā "mīļotus"
document.getElementById('poga-iecienitie').addEventListener('click', () => {
    if(debug) console.log('4');
    let kartosanasID = document.getElementById('ievadaGrupasIzvele03').value;
    let virzID = document.getElementById('ievadaGrupasIzvele04').value;

    fetch(`/meklet?meklesanasID=-2&kartosanasID=${kartosanasID}&virzID=${virzID}`, {method: 'POST'})
    .then(function(response) {
        if(debug) console.log('5');

        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        izvadesDati = [];
        //Paslēpj un idzēš vērtības kastē ar seriāliem un kastē ar epizodēm jo tie būs atklāti kad veidoti
        document.getElementById('epizozuIzvade').style.display = 'none';
        document.getElementById('epizozuIzvade').innerHTML = "";
        document.getElementById('serialuIzvade').innerHTML = '';   
        document.getElementById('serialuIzvade').style.display = 'none';

        //Pārbauda vai datu masīvā vispār ir vērtības
        if (data[0] === undefined) {
            neatrada();
        } else {
            let seriali = [];
            let epizodes = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].efavourite == 1) {
                    epizodes.push(data[i]);
                }
                if (data[i].favourite == 1) {
                    document.getElementById('serialuIzvade').style.display = 'flex';
                    seriali.push(data[i]);
                }
            }
            izvadesDati = epizodes;
            lapa = 0;
            document.getElementById('serialuIzvade').innerHTML = '';
            let serialuIDs = [];
            if (epizodes.length > 6) {
                for (let i = 0; i < 6; i++) {
                    epizodesVeidosana(epizodes, i);
                }
            } else {
                for (let i = 0; i < epizodes.length; i++) {
                    epizodesVeidosana(epizodes, i);
                }
            }
            if (seriali.length > 6) {
                for (let i = 0; i < seriali.length; i++) {
                    if (!serialuIDs.includes(seriali[i].show_id)) {
                        serialuIDs.push(seriali[i].show_id);
                        serialaVeidosana(seriali, i);
                    }
                }
            } else {
                for (let i = 0; i < seriali.length; i++) {
                    if (!serialuIDs.includes(seriali[i].show_id)) {
                        serialuIDs.push(seriali[i].show_id);
                        serialaVeidosana(seriali, i);
                    }
                }
            }
        }
        //Pārbauda vai bultiņām jāizskatās uzspiežamām
    bultuParbauds();
    })
    .catch(function(error) {
        console.log(error);
    });
});

//Meklēšanas funkcija
function meklet() {
    if(debug) console.log('2')

    let tekstaVertiba = document.getElementById('teksta-ievade').value;
    if (tekstaVertiba == '') tekstaVertiba = 'Pier Pressure';
    let zanrs = document.getElementById('ievadaGrupasIzvele02').value;
    let meklesanasID = document.getElementById('ievadaGrupasIzvele01').value;
    let kartosanasID = document.getElementById('ievadaGrupasIzvele03').value;
    let virzID = document.getElementById('ievadaGrupasIzvele04').value;

   fetch(`/meklet?ievaditais=${tekstaVertiba}${zanrs != "Žanrs" ? '&zanrs='+zanrs : ''}&meklesanasID=${meklesanasID}&kartosanasID=${kartosanasID}&virzID=${virzID}`, {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        //Paslēpj un idzēš vērtības kastē ar seriāliem, jo tos nevar atrast un izdzēš vērtības kastē ar epizodēm, lai tie netraucētu
        document.getElementById('epizozuIzvade').innerHTML = "";
        document.getElementById('serialuIzvade').innerHTML = '';
        document.getElementById('serialuIzvade').style.display = 'none';

        //Pārbauda vai datu masīvā vispār ir vērtības
        if (data[0] === undefined) {
            neatrada();
        } else {
            izvadesDati = data;
            if(debug) console.log(data);
            lapa = 0;
            if (data.length > 6) {
                for (let i = 0; i < 6; i++) {
                    epizodesVeidosana(data, i);
                }
            } else {
                for (let i = 0; i < data.length; i++) {
                    epizodesVeidosana(data, i);
                }
            }
            //Pārbauda vai bultiņām jāizskatās uzspiežamām
            bultuParbauds();
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

//Izvada kļūdu ja nevarēja atrast jebkādu epizodi datu bāzē
function neatrada() {
    //Paslēpj un idzēš vērtības kastē ar seriāliem jo tos neizvad
    document.getElementById('serialuIzvade').style.display = 'none';
    document.getElementById('epizozuIzvade').style.display = 'flex';
    //Iedod klasi kas krāso fonu kastei sarkanu, kas nozīmē kļūda
    document.getElementById('epizozuIzvade').classList.add('bg-danger');
    //teksta kaste
    let div = document.createElement("div");
    document.getElementById("epizozuIzvade").appendChild(div);
    div.classList.add('output-inside')
    //teksts
    let text = document.createElement('p');
    div.appendChild(text);
    //text.id = 'teksta-izvade'
    text.innerHTML = `Nevarēju atrast!`
}

//Izvada visus seriālus kas ir datu bāzē
document.getElementById('poga-visi-seriali').addEventListener('click', (visiSeriali))
function visiSeriali() {
    fetch(`/seriali`, {method: 'GET'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        //izvadesDati tiek iztīrīts, jo mainīt lapas nav iespējams pēc šīs funkcijas
        izvadesDati = [];
        lapa = 0;
        //Paslēpj un idzēš vērtības kastē ar epizodēm jo tie nebūs izvadīti
        document.getElementById('epizozuIzvade').innerHTML = "";
        document.getElementById('epizozuIzvade').style.display = 'none';

        //Pārbauda vai datu masīvā vispār ir vērtības
        if (data[0] === undefined) {
            neatrada();
        } else {
            document.getElementById('serialuIzvade').innerHTML = '';
            for (let i = 0; i < data.length; i++) {
                serialaVeidosana(data, i);
            }
        }
        //Pārbauda vai bultiņām jāizskatās uzspiežamām
        bultuParbauds();
    })
    .catch(function(error) {
        console.log(error);
    });
}

//Izvada visas epizodes kas ir seriālam uz kura uzspiež
function serialaEpizodes() {
    if(debug) console.log('3')

    let tekstaVertiba = this.alt;
    //Seriālam 'Love, Death & Robots' bija kļūda, kas tika izlabota šifrējot to vērtību izmantojot šo funkciju
    tekstaVertiba = encodeURIComponent(tekstaVertiba);

   fetch(`/meklet?serialaID=${tekstaVertiba}&meklesanasID=-1`, {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        }
        throw new Error('Request failed.');
    })
    .then(function(data) {
        //Izdzēš iepriekšējās vērtības lai tās netraucētu
        document.getElementById('epizozuIzvade').innerHTML = "";
        document.getElementById('serialuIzvade').innerHTML = '';
        
        //Pārbauda vai datu masīvā vispār ir vērtības
        if (data[0] === undefined) {
            neatrada();
        } else {
            izvadesDati = data;
            lapa = 0;
            document.getElementById('serialuIzvade').innerHTML = '';
            //Ja datu masīva garums ir lielāks par 6, tad izvad pirmās 6 vērtības, citādāk izvada visas vērtības
            if (data.length > 6) {
                for (let i = 0; i < 6; i++) {
                    epizodesVeidosana(data, i);
                }
            } else {
                for (let i = 0; i < data.length; i++) {
                    epizodesVeidosana(data, i);
                }
            }
            //Izvad vienu seriāla karti, izmantojot 0 vērtību, jo seriāla vērtības no datu masīva vienmēr būs vienādas
            serialaVeidosana(data, 0);
            //Pārbauda vai bultiņām jāizskatās uzspiežamām
            bultuParbauds();
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

//Veido seriālu kartiņas
function serialaVeidosana(data, i) {
    //Šis divs ir kaste kas iekļauj visus seriālus
    div = document.getElementById('serialuIzvade');
    let img = document.createElement("img");
    //Alt vērtība ir vēlāk izmantota lai atpazīt kuram seriālam pieder bilde
    img.setAttribute('alt', `${data[i].name}`);
    img.classList.add('logo');
    if (tumss) {
        img.style.backgroundColor = '#ffffff90';
    } else {
        img.style.backgroundColor = '#00000010';
    }

    //Zvaigzne kas atzīmē mīļotos seriālus
    let star = document.createElement('p');
    if(data[i].favourite == 1) {
        star.classList.add('fas', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    } else {
        star.classList.add('far', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    }
    star.setAttribute('data-serials', data[i].show_id);

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
    star.addEventListener('click', (iecienit));
    img.addEventListener("click", (serialaEpizodes));
}

//Izveido epizodes kartiņas
function epizodesVeidosana(data, i) {
    //Šis divs ir kaste kas iekļauj visas epizodes
    document.getElementById('epizozuIzvade').style.display = 'flex';
    document.getElementById('epizozuIzvade').classList.remove('bg-danger');

    //Zvaigzne kas atzīmē mīļotos seriālus
    let star = document.createElement('p');
    if(data[i].efavourite == 1) {
        star.classList.add('fas', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    } else {
        star.classList.add('far', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    }
    star.setAttribute('data-epizode', data[i].episode_id);

    //Veido epizodes karti
    let div = document.createElement("div");
    document.getElementById("epizozuIzvade").appendChild(div);
    div.classList.add('card', 'm-2')

    div.appendChild(star);

    let img = document.createElement("img");
    //Alt vērtība ir vēlāk izmantota lai atpazīt kuram seriālam pieder bilde
    img.setAttribute('alt', `${data[i].name}`)
    img.classList.add('logo');
    div.appendChild(img);
    if (tumss) {
        img.style.backgroundColor = '#ffffff90';
    } else {
        img.style.backgroundColor = '#00000010';
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
    star.addEventListener('click', (iecienit));
    img.addEventListener("click", (serialaEpizodes));
}

//Padara epizodi vai seriālu par mīļāko, lai to varētu ātrāk atrast
function iecienit() {
    let f;
    //Ja klase ir fas, tad seriāls vai epizode jau ir atzīmēti kā mīļoti, citādāk tie nav atzīmēti kā mīļoti
    if (this.classList.contains('fas')) {
        f = 1;
        if (this.dataset.epizode) {
            if (debug) console.log('epizode fav 0');
            //Maina vērtību izvadesDati, lai mainot lapu saglabājās vērtību aizejot atpakaļ
            for (let i in izvadesDati) {
                if (izvadesDati[i].episode_id == this.dataset.epizode) {
                    izvadesDati[i].efavourite = 0;
                }
            }
        } else {
            if (debug) console.log('serials fav 0');
            //Maina vērtību izvadesDati, lai mainot lapu saglabājās vērtību aizejot atpakaļ
            for (let i in izvadesDati) {
                if (izvadesDati[i].show_id == this.dataset.epizode) {
                    izvadesDati[i].favourite = 0;
                }
            }
        }
    } else {
        f = 0;
        if (this.dataset.epizode) {
            if (debug) console.log('epizode fav 1');
            //Maina vērtību izvadesDati, lai mainot lapu saglabājās vērtību aizejot atpakaļ
            for (let i in izvadesDati) {
                if (izvadesDati[i].episode_id == this.dataset.epizode) {
                    izvadesDati[i].efavourite = 1;
                }
            }
        } else {
            if (debug) console.log('serials fav 1');
            //Maina vērtību izvadesDati, lai mainot lapu saglabājās vērtību aizejot atpakaļ
            for (let i in izvadesDati) {
                if (izvadesDati[i].show_id == this.dataset.epizode) {
                    izvadesDati[i].favourite = 1;
                    break;
                }
            }
        }
    }
    //Pārslēdz pilnu zvaigzni ar nepilnu zvaigzni un otrādi
    this.classList.toggle('fas');
    this.classList.toggle('far');
    //Pārbauda vai tiek mīļota/nemīļota epizode vai seriāls
    if(this.dataset.epizode) {
        fetch(`/iecienit?iecienit=${f}&epizodesID=${this.dataset.epizode}`, {method: 'POST'})
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
        fetch(`/iecienit?iecienit=${f}&serialaID=${this.dataset.serials}`, {method: 'POST'})
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
function bultuParbauds() {
    //Nulletajā lapā kreisā bultiņa nekad neizskatīsies spiežama, bet citās lapās vislai izskatīsies spiežama
    if (lapa == 0) {
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
    if ((izvadesDati.length - (((lapa+1)*6))) > 0) {
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
function lapasMaina(virz) {
    if (debug) console.log(lapa);
    if (debug) console.log((izvadesDati.length - (((lapa+1)*6))));
    //Pārbauda kurā virzienā rāda poga
    if (virz == 'l'){
        //Ja nākošā lapā ir vēl 6 vai vairāk epizodes, tad tiek izvadītas 6 epizodes, citādi ja nākošā lapā epizožu skaits ir mazāk par 6, tad izvada visas palikušās epizodes un ne vairāk, ja vairs nav epizožu tad nekas nenotiek
        if ((izvadesDati.length - (((lapa+1)*6))) >= 6) {
            lapa++;
            document.getElementById('epizozuIzvade').innerHTML = '';
        for (let i = lapa*6; i < (lapa+1)*6; i++) {
            epizodesVeidosana(izvadesDati, i);
        }
        } else if (((izvadesDati.length - (((lapa+1)*6))) < 6) && (izvadesDati.length - (((lapa+1)*6))) > 0) {
            lapa++;
            document.getElementById('epizozuIzvade').innerHTML = '';
            for (let i = lapa*6; i < izvadesDati.length; i++) {
                epizodesVeidosana(izvadesDati, i);
            }
        }
    } else if (virz == 'k') {
        //Ja pagaišās lapas sākuma ID nav mazāks par 0, tad izvada 6 iepriekšējās epizodes
        if ((lapa-1)*6  >= 0) {
            lapa--;
            document.getElementById('epizozuIzvade').innerHTML = '';
        for (let i = lapa*6; i < (lapa+1)*6; i++) {
            epizodesVeidosana(izvadesDati, i);
        }
        }
    }
    //Pārbauda vai bultiņām jāizskatās uzspiežamām
    bultuParbauds();
}
//Uzreiz izvad visus seriālus datu bāzē
visiSeriali();

//Maina meklēšanas elementus lai tie būtu labāk redzami uz maziem un telefona ekrāniem
function ekranIzmers(){
    let a = document.getElementById('ievada-grupa');
    let a2 = document.getElementById('ievada-grupa2');

    //input-group-sm ir mazāka versija input-group bootstrap klasei
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
ekranIzmers();
//Kad mainās ekrāna izmērs, sākās ekrāna lieluma maiņas funkcija
window.addEventListener('resize', ekranIzmers);

function tumsaisRezims(krasa) {
    //Maina tumšo un gaišo režīmu
    if (krasa) { // True - paliek tumšs, false - paliek gaišs
        tumss = true;

        //Maina dažādu elementu stilu uz tumšo režīmu
        document.getElementById('html').setAttribute('data-bs-theme','dark');
        //Maina navigācijas joslas krāsu 
        document.getElementById('navbar').style.backgroundColor = '#863707';
        //Maina fona krāsu
        document.getElementById('body').style.backgroundColor = '#066efd';
        //Maina seriālu kastes fonu
        document.getElementById('serialuIzvade').style.backgroundColor = '#363'
        //Maina epizožu kastes fonu
        document.getElementById('epizozuIzvade').style.backgroundColor = '#363'
        //Pievieno katrai bildei vieglu caurspīdīgu fonu priekš kontrasta
        for (let i = 0; i < document.getElementsByClassName('logo').length; i++) {
            document.getElementsByClassName('logo')[i].style.background = '#ffffff90';
        }
    } else {
        tumss = false;

        //Noņem dažādu elementu stilu no tumšā režīma
        document.getElementById('html').removeAttribute('data-bs-theme','dark');
        //Maina navigācijas joslas krāsu
        document.getElementById('navbar').style.backgroundColor = '#fd7e14';
        //Maina fona krāsu
        document.getElementById('body').style.backgroundColor = '#0dcaf0';
        //Maina seriālu kastes fonu
        document.getElementById('serialuIzvade').style.backgroundColor = '#7c7'
        //Maina epizožu kastes fonu
        document.getElementById('epizozuIzvade').style.backgroundColor = '#7c7'
        //Pievieno katrai bildei vieglu caurspīdīgu fonu priekš kontrasta
        for (let i = 0; i < document.getElementsByClassName('logo').length; i++) {
            document.getElementsByClassName('logo')[i].style.background = '#00000010';
        }
    }
    //Pārbauda vai tagad ir gaišais vai tumšais režīms
}
tumsaisRezims(false);

function sriftaMaina(srifts) {
    body = document.getElementById('body');
    if (srifts == 'Helvetica') {
        body.className = '';
    } else {
        body.className = '';
        body.classList.add(srifts);
    }
}