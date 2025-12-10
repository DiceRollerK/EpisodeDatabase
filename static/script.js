//Ja vērtība ir 'true' tad būs izvadītas dažādas atkļūdošanas vērtības
let debug = false;
//izvadesDati saglabā datus, kurus var izmantot visā dokumentā, tas tiek izmantots lapas maiņas funkcijā
let izvadesDati
//saglabā kura lapa ir izvadīta, sākot ar 0
let lapa = 0;
let tumss = false;

//Izvada visas epizodes kas ir datu bāzē
document.getElementById("poga-visas-epizodes").addEventListener("click", () =>{
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
        //Paslēpj iepriekšējās kastes un izdzēš iepriekšējās vērtības
        iztirit();
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
        lapa = 0;
        //Paslēpj un idzēš vērtības kastē ar seriāliem un kastē ar epizodēm jo tie būs atklāti kad veidoti
        iztirit();

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

    if(debug) console.log(/^[a-zA-Z0-9&,.'\! ]*$/g.test(tekstaVertiba));

    if (/^[a-zA-Z0-9&,.'\! ]*$/g.test(tekstaVertiba)) {
        tekstaVertiba = tekstaVertiba.replace('&', 'and');
        tekstaVertiba = tekstaVertiba.replace('\'s', '');
        tekstaVertiba = tekstaVertiba.replace('\'', '');


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
        iztirit();

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
    } else {
        izvadesDati = [];
        bultuParbauds();
        //Paslēpj un idzēš vērtības kastē ar seriāliem jo tos neizvad
        iztirit();
        document.getElementById('epizozuIzvade').style.display = 'flex';
        //Iedod klasi kas krāso fonu kastei sarkanu, kas nozīmē kļūda
        document.getElementById('epizozuIzvade').classList.add('bg-danger');
        //teksta kaste
        let kludasKaste = document.createElement("div");
        document.getElementById("epizozuIzvade").appendChild(kludasKaste);
        kludasKaste.classList.add('output-inside')
        //teksts
        let teksts = document.createElement('p');
        kludasKaste.appendChild(teksts);
        teksts.innerHTML = `Ievadītas nederīgas vērtības!`
    }
}

//Izvada kļūdu ja nevarēja atrast jebkādu epizodi datu bāzē
function neatrada() {
    izvadesDati = [];
    bultuParbauds();
    //Paslēpj un idzēš vērtības kastē ar seriāliem jo tos neizvad
    iztirit();
    document.getElementById('epizozuIzvade').style.display = 'flex';
    //Iedod klasi kas krāso fonu kastei sarkanu, kas nozīmē kļūda
    document.getElementById('epizozuIzvade').classList.add('bg-danger');
    //teksta kaste
    let kludasKaste = document.createElement("div");
    document.getElementById("epizozuIzvade").appendChild(kludasKaste);
    kludasKaste.classList.add('output-inside')
    //teksts
    let teksts = document.createElement('p');
    kludasKaste.appendChild(teksts);
    teksts.innerHTML = `Nevarēju atrast!`
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
        //Paslēpj un idzēš nevajadzīgās vērtības
        iztirit();

        //Pārbauda vai datu masīvā vispār ir vērtības
        if (data[0] === undefined) {
            neatrada();
        } else {
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
        iztirit();
        
        //Pārbauda vai datu masīvā vispār ir vērtības
        if (data[0] === undefined) {
            neatrada();
        } else {
            izvadesDati = data;
            lapa = 0;
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
    serialuKaste = document.getElementById('serialuIzvade');
    let logo = document.createElement("img");
    //Alt vērtība ir vēlāk izmantota lai atpazīt kuram seriālam pieder bilde
    logo.setAttribute('alt', `${data[i].name}`);
    logo.classList.add('logo');
    if (tumss) {
        logo.style.backgroundColor = '#ffffff90';
    } else {
        logo.style.backgroundColor = '#00000010';
    }

    //Zvaigzne kas atzīmē mīļotos seriālus
    let zvaigzne = document.createElement('p');
    if(data[i].favourite == 1) {
        zvaigzne.classList.add('fas', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    } else {
        zvaigzne.classList.add('far', 'fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    }
    zvaigzne.setAttribute('data-serials', data[i].show_id);

    //Veido seriāla karti
    let serialaKarte = document.createElement('div');
    serialuKaste.appendChild(serialaKarte);

    serialaKarte.appendChild(zvaigzne)

    //Kartes noformējums
    serialaKarte.classList.add('card', 'm-2', 'bg-success-subtle');
    serialaKarte.appendChild(logo);

    let kartinasIeksa  = document.createElement("div");
    serialaKarte.appendChild(kartinasIeksa);
    kartinasIeksa.classList.add('card-body', 'p-2');
    
    //Teksta stils
    let nosaukums = document.createElement('h5');
    nosaukums.classList.add("card-title", "fs-4'");
    let teksts = document.createElement('p');
    teksts.classList.add("card-text", "fs-5");
                
    kartinasIeksa.appendChild(nosaukums);
    kartinasIeksa.appendChild(teksts);

    //Ievieto informāciju kartē
    logo.setAttribute("src", `${data[i].logo}`);
    nosaukums.innerHTML = `${data[i].name}`
    teksts.innerHTML = 
    `
    Raidīšanas gadi: ${data[i].start_date} līdz ${data[i].end_date}<br>
    Žanri: ${data[i].genre1}${data[i].genre2 != null ? ', '+data[i].genre2.toLowerCase() : ''}${data[i].genre3 != null ? ', '+data[i].genre3.toLowerCase() : ''}<br>
    Tēmas: ${data[i].theme1}, ${data[i].theme2.toLowerCase()}, ${data[i].theme3.toLowerCase()}
    `;
    serialaKarte.style.display = 'flex';
    serialuKaste.style.display = 'flex';

    //Pievieno funkcijas elementiem pēc to izveidošanas
    zvaigzne.addEventListener('click', (iecienit));
    logo.addEventListener("click", (serialaEpizodes));
}

//Izveido epizodes kartiņas
function epizodesVeidosana(data, i) {
    //Šis divs ir kaste kas iekļauj visas epizodes
    document.getElementById('epizozuIzvade').style.display = 'flex';
    document.getElementById('epizozuIzvade').classList.remove('bg-danger');

    //Zvaigzne kas atzīmē mīļotos seriālus
    let zvaigzne = document.createElement('p');
    zvaigzne.classList.add('fa-star','ms-1','mt-2','me-3','z-1','position-absolute');
    if(data[i].efavourite == 1) {
        //Pilna zvaigzne
        zvaigzne.classList.add('fas');
    } else {
        //Zvaigznes kontūrs
        zvaigzne.classList.add('far');
    }
    zvaigzne.setAttribute('data-epizode', data[i].episode_id);

    //Veido epizodes karti
    let epizodesKarte = document.createElement("div");
    document.getElementById("epizozuIzvade").appendChild(epizodesKarte);
    epizodesKarte.classList.add('card', 'm-2')

    epizodesKarte.appendChild(zvaigzne);

    let logo = document.createElement("img");
    //Alt vērtība ir vēlāk izmantota lai atpazīt kuram seriālam pieder bilde
    logo.setAttribute('alt', `${data[i].name}`)
    logo.classList.add('logo');
    epizodesKarte.appendChild(logo);
    if (tumss) {
        logo.style.backgroundColor = '#ffffff90';
    } else {
        logo.style.backgroundColor = '#00000010';
    }

    //Kartes noformējums
    let kartinasIeksa  = document.createElement("div");
    epizodesKarte.appendChild(kartinasIeksa);
    kartinasIeksa.classList.add('card-body', 'p-2');
    
    //Teksta stils
    let nosaukums = document.createElement('h5');
    nosaukums.classList.add("card-title", "fs-4'");
    let teksts = document.createElement('p');
    teksts.classList.add("card-text", "fs-5");
    kartinasIeksa.appendChild(nosaukums);
    kartinasIeksa.appendChild(teksts);

    //Ievieto informāciju kartē
    logo.setAttribute("src", data[i].logo);
    nosaukums.innerHTML = `&quot;${data[i].ename}&quot;`
    teksts.innerHTML = 
    `
    Sezona-epizode: ${data[i].season}-${data[i].episode}<br>
    Raidīšanas datums: ${data[i].date}<br>
    Žanrs: ${data[i].genre}<br>
    Stāsta elementi: ${data[i].element1}${data[i].element2 != null ? ', '+data[i].element2.toLowerCase() : ''}${data[i].element3 != null ? ', '+data[i].element3.toLowerCase() : ''}
    `;
    //Pievieno funkcijas elementiem pēc to izveidošanas
    zvaigzne.addEventListener('click', (iecienit));
    logo.addEventListener("click", (serialaEpizodes));
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
        bultasMaina(document.getElementsByClassName('fa-caret-square-left'), false);
    } else {
        bultasMaina(document.getElementsByClassName('fa-caret-square-left'), true);
    }
    //Ja nākošajā lapā atrodas vismas viena epizode, tad labā bultiņa izskatās uzspiežama
    if ((izvadesDati.length - (((lapa+1)*6))) > 0) {
        bultasMaina(document.getElementsByClassName('fa-caret-square-right'), true);
    } else {
        bultasMaina(document.getElementsByClassName('fa-caret-square-right'), false);
    }
}

function bultasMaina(bultas, spiezams) {
    if (spiezams) {
        //Noņem bultas kontūru
        bultas[0].classList.remove('far');
        bultas[1].classList.remove('far');
        //Pievieno bultas pildījumu
        bultas[0].classList.add('fas');
        bultas[1].classList.add('fas');
        //Pelīte rāda ka var uzspiest uz bultas
        bultas[0].style.cursor = 'pointer';
        bultas[1].style.cursor = 'pointer';
    } else {
        //Noņem bultas pildījumu
        bultas[0].classList.remove('fas');
        bultas[1].classList.remove('fas');
        //Pievieno bultas kontūru
        bultas[0].classList.add('far');
        bultas[1].classList.add('far');
        //Pelīte nerāda ka varētu spiest uz pogas
        bultas[0].style.cursor = 'initial';
        bultas[1].style.cursor = 'initial';
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

//Maina meklēšanas elementus lai tie būtu labāk redzami uz maziem un telefona ekrāniem
function ekranIzmers(){
    let tekstaIevads = document.getElementById('ievada-grupa');
    let izvelnes = document.getElementById('ievada-grupa2');

    //input-group-sm ir mazāka versija input-group bootstrap klasei
    if (window.innerWidth <= 900) {
        tekstaIevads.classList.add('input-group-sm');
        izvelnes.classList.add('input-group-sm');
    }else{ 
        tekstaIevads.classList.remove('input-group-sm');
        izvelnes.classList.remove('input-group-sm');
    }

    //Maina izveļņu izvadi kolonnās, jo tā paliek iespējams tos spiest
    if(window.innerWidth <= 600) {
        izvelnes.classList.remove('input-group');
        izvelnes.classList.remove('input-group-sm');
        izvelnes.classList.add('d-flex')
        izvelnes.classList.add('flex-column')
    } else {
        izvelnes.classList.add('input-group');
        izvelnes.classList.remove('d-flex')
        izvelnes.classList.remove('flex-column');
    }
}
ekranIzmers();
//Kad mainās ekrāna izmērs, sākās ekrāna lieluma maiņas funkcija
window.addEventListener('resize', ekranIzmers);

function tumsaisRezims(krasa) {
    //Maina tumšo un gaišo režīmu
    if (krasa == true) { // True - paliek tumšs, false - paliek gaišs
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
        localStorage.setItem('krasa','tumšs');
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
        localStorage.setItem('krasa','gaišs');
    }
}

function iztirit() {
    document.getElementById('serialuIzvade').style.display = 'none';
    document.getElementById('epizozuIzvade').style.display = 'none';
    document.getElementById('serialuIzvade').innerHTML = '';
    document.getElementById('epizozuIzvade').innerHTML = '';
}

function sriftaMaina(srifts) {
    body = document.getElementById('body');
    body.className = '';
    body.classList.add(srifts);
    localStorage.setItem('srifts',srifts);
}

function sakums(srifts, krasa) {
    if (krasa == 'tumšs') {
        tumsaisRezims(true);
    } else {
        tumsaisRezims(false);
    }
    sriftaMaina(srifts);
    visiSeriali();
}
sakums(localStorage.getItem('srifts'),localStorage.getItem('krasa'));