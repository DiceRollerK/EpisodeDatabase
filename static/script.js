//Ja vērtība ir 'true' tad būs izvadītas dažādas atkļūdošanas vērtības
let debug = false;
//izvadesDati saglabā datus, kurus var izmantot visā dokumentā, tas tiek izmantots lapas maiņas funkcijā
let izvadesDati;
let serialuDati;
//saglabā kura epizožu lapa ir izvadīta, sākot ar 0
let epizozuLapa = 0;
let serialuLapa = 0;
let tumss = false;
let user_id;

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
    fetch(`/clicked?kartosanasID=${kartosanasID}&virzID=${virzID}${zanrs != "Žanrs" ? '&zanrs='+zanrs : ''}&user=${user_id}`, {method: 'POST'})
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
        
        //Izdzēš iepriekšējās vērtības kastē ar epizodēm un padara to redzamu
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
        bultuVeidosana(0);
        bultuParbaude(0);
    })
    .catch(function(error) {
        console.log(error);
    });
})

function bultuVeidosana(kur) {
    let bulta1K;
    let bulta1L;
    let bulta2K;
    let bulta2L;
    let kaste;

    if (kur == 0) { //serialu kaste
        bulta1K = bultasVeidosana(false,false);
        bulta1L = bultasVeidosana(true,false);
        bulta2K = bultasVeidosana(false,false);
        bulta2L = bultasVeidosana(true,false);
        
        kaste = document.getElementById('epizozuAugsejasBultas')
        kaste.appendChild(bulta1K);
        kaste.appendChild(bulta1L);
        kaste = document.getElementById('epizozuApaksejasBultas');
        kaste.appendChild(bulta2K);
        kaste.appendChild(bulta2L);
    } else if (kur == 1) { //epizožu kaste
        bulta1K = bultasVeidosana(false,true);
        bulta1L = bultasVeidosana(true,true);
        bulta2K = bultasVeidosana(false,true);
        bulta2L = bultasVeidosana(true,true);

        kaste = document.getElementById('serialuAugsejasBultas');
        kaste.appendChild(bulta1K);
        kaste.appendChild(bulta1L);
        kaste = document.getElementById('serialuApaksejasBultas');
        kaste.appendChild(bulta2K);
        kaste.appendChild(bulta2L);
    } else { //abos
        bulta1K = bultasVeidosana(false,true);
        bulta1L = bultasVeidosana(true,true);
        bulta2K = bultasVeidosana(false,true);
        bulta2L = bultasVeidosana(true,true);

        kaste = document.getElementById('serialuAugsejasBultas');
        kaste.appendChild(bulta1K);
        kaste.appendChild(bulta1L);
        kaste = document.getElementById('serialuApaksejasBultas');
        kaste.appendChild(bulta2K);
        kaste.appendChild(bulta2L);

        let bulta3K = bultasVeidosana(false,false);
        let bulta3L = bultasVeidosana(true,false);
        let bulta4K = bultasVeidosana(false,false);
        let bulta4L = bultasVeidosana(true,false);

        kaste = document.getElementById('epizozuAugsejasBultas')
        kaste.appendChild(bulta3K);
        kaste.appendChild(bulta3L);
        kaste = document.getElementById('epizozuApaksejasBultas');
        kaste.appendChild(bulta4K);
        kaste.appendChild(bulta4L);
    }
}

function bultasVeidosana(virz, kur) {
    let bulta = document.createElement('p');
    if (virz) { //true = uz labo, false = uz kreiso
        bulta.classList.add('fa-caret-square-right');
    } else {
        bulta.classList.add('fa-caret-square-left');
    }
    if(kur) { //true = serials, false = epizode
        if (virz) {
            bulta.addEventListener('click', () => {serialuLapasMaina('l')});
        } else {
            bulta.addEventListener('click', () => {serialuLapasMaina('k')});
        }
    } else {
        if (virz) {
            bulta.addEventListener('click', () => {epizozuLapasMaina('l')});
        } else {
            bulta.addEventListener('click', () => {epizozuLapasMaina('k')});
        }
    }
    return bulta;
}

//Atļauj meklēt uzspiežot gan meklēšanas pogu, gan uzspiežot uz klaviatūras 'enter'
document.getElementById("poga-meklet").addEventListener("click", meklet);
document.getElementById("teksta-ievade").addEventListener("keydown", function(e) {
    if (e.key === 'Enter') {
        meklet();
    }
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

    fetch(`/meklet?ievaditais=${tekstaVertiba}${zanrs != "Žanrs" ? '&zanrs='+zanrs : ''}&meklesanasID=${meklesanasID}&kartosanasID=${kartosanasID}&virzID=${virzID}&user=${user_id}`, {method: 'POST'})
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
            kluda(0);
        } else {
            izvadesDati = data;
            if(debug) console.log(data);
            
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
            bultuVeidosana(0);
            bultuParbaude(0);
        }
    })
    .catch(function(error) {
        console.log(error);
    });
    } else {
        kluda(3);
    }
}

//Izvada visas epizodes un seriālus kurus lietotājs ir atzīmējis kā "mīļotus"
document.getElementById('poga-iecienitie').addEventListener('click', () => {
    if (user_id != 0) {
    if(debug) console.log('4');
    let kartosanasID = document.getElementById('ievadaGrupasIzvele03').value;
    let virzID = document.getElementById('ievadaGrupasIzvele04').value;

    fetch(`/meklet?meklesanasID=-2&kartosanasID=${kartosanasID}&virzID=${virzID}&user=${user_id}`, {method: 'POST'})
    .then(function(response) {
        if(debug) console.log('5');

        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        
        //Paslēpj un idzēš vērtības kastē ar seriāliem un kastē ar epizodēm jo tie būs atklāti kad veidoti
        iztirit();

        //Pārbauda vai datu masīvā vispār ir vērtības
        if (data[0] === undefined) {
            kluda(2);
        } else {
            serialuLapa = 0;
            epizozuLapa = 0;
            let seriali = [];
            let epizodes = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].efavourite == 1) {
                    epizodes.push(data[i]);
                }
                if (data[i].sfavourite == 1) {
                    seriali.push(data[i]);
                }
            }
            izvadesDati = epizodes;
            serialuDati = seriali;
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
                let i = 0;
                while (i < seriali.length && serialuIDs.length < 6) {
                    if (!serialuIDs.includes(seriali[i].show_id)) {
                        serialuIDs.push(seriali[i].show_id);
                        serialaVeidosana(seriali, i);
                    }
                    i++;
                }
            } else {
                for (let i = 0; i < seriali.length; i++) {
                    if (!serialuIDs.includes(seriali[i].show_id)) {
                        serialuIDs.push(seriali[i].show_id);
                        serialaVeidosana(seriali, i);
                    }
                    i++;
                }
            }
            bultuVeidosana(2);
            bultuParbaude(2);
        }
        //Pārbauda vai bultiņām jāizskatās uzspiežamām
    })
    .catch(function(error) {
        console.log(error);
    });
    } else {
        kluda(7);
    }
});

//Izvada kļūdu ja nevarēja atrast jebkādu epizodi datu bāzē
function kluda(iemesls) {
    izvadesDati = [];
    //Paslēpj un idzēš vērtības kastē ar seriāliem jo tos neizvad
    iztirit();
    document.getElementById('epizozuIzvade').style.display = 'flex';
    //Iedod klasi kas krāso fonu kastei sarkanu, kas nozīmē kļūda
    //teksta kaste
    let kludasKaste = document.createElement("div");
    document.getElementById("epizodem").appendChild(kludasKaste);
    kludasKaste.classList.add('output-inside')
    //teksts
    let teksts = document.createElement('p');
    kludasKaste.appendChild(teksts);
    switch (iemesls) {
        default: 
            document.getElementById('epizozuIzvade').classList.add('bg-danger');
            document.getElementById('epizodem').classList.add('bg-danger');
            teksts.innerHTML = 'Atvainojamies, ir nezināma kļūda.'; 
            break;
        case 0:
            document.getElementById('epizozuIzvade').classList.add('bg-danger');
            document.getElementById('epizodem').classList.add('bg-danger');
            teksts.innerHTML = 'Neatradu nevienu epizodi!'; 
            break;
        case 1:
            document.getElementById('epizozuIzvade').classList.add('bg-danger');
            document.getElementById('epizodem').classList.add('bg-danger');
            teksts.innerHTML = 'Neatradu nevienu seriālu!';
            break;
        case 2:
            document.getElementById('epizozuIzvade').classList.add('bg-danger');
            document.getElementById('epizodem').classList.add('bg-danger');
            teksts.innerHTML = 'Nav neviena iecienītas epizodes vai seriāla!'; 
            break;
        case 3:
            document.getElementById('epizozuIzvade').classList.add('bg-danger');
            document.getElementById('epizodem').classList.add('bg-danger');
            let kluda = document.getElementById('teksta-ievade').value.replace(/[a-zA-Z0-9&,.'\! ]/g,'')
            teksts.innerHTML = `Meklējumā ir nederīgais rakstzīme '${kluda}', ja šī rakstzīme atrodas nosaukumā, tad mēģiniet rakstīt to bez tās.`
            break;
        case 4:
            document.getElementById('epizozuIzvade').classList.add('bg-danger');
            document.getElementById('epizodem').classList.add('bg-danger');
            teksts.innerHTML = 'Nepareizi ievadīti dati, vai neeksistējošs konts!'
            break;
        case 5:
            document.getElementById('epizozuIzvade').classList.add('bg-danger');
            document.getElementById('epizodem').classList.add('bg-danger');
            teksts.innerHTML = 'Jums vajadzēs izveidot kontu lai darīt to!'
            break;
        case 6: 
            document.getElementById('epizozuIzvade').classList.add('bg-danger');
            document.getElementById('epizodem').classList.add('bg-danger');
            teksts.innerHTML = 'Konts ar tādu lietotājvārdu jau eksistē!'
            break;
        case 7:
            document.getElementById('epizozuIzvade').classList.add('bg-danger');
            document.getElementById('epizodem').classList.add('bg-danger');
            teksts.innerHTML = 'Iecienitos var apskatīt tikai ar kontu!'
            break;
    }
}

//Izvada visus seriālus kas ir datu bāzē
document.getElementById('poga-visi-seriali').addEventListener('click', (visiSeriali))
function visiSeriali() {
    fetch(`/seriali?user=${user_id}`, {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        //izvadesDati tiek iztīrīts, jo mainīt lapas nav iespējams pēc šīs funkcijas
        izvadesDati = [];
        //Paslēpj un idzēš nevajadzīgās vērtības
        iztirit();

        //Pārbauda vai datu masīvā vispār ir vērtības
        if (data[0] === undefined) {
            kluda(1);
        } else {
            serialuDati = data;
            if (data.length > 6) {
                for (let i = 0; i < 6; i++) {
                    serialaVeidosana(data, i);
                }
            } else {
                for (let i = 0; i < data.length; i++) {
                    serialaVeidosana(data, i);
                }
            }
            //Pārbauda vai bultiņām jāizskatās uzspiežamām
            bultuVeidosana(1);
            bultuParbaude(1);
        }
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

   fetch(`/meklet?serialaID=${tekstaVertiba}&meklesanasID=-1&user=${user_id}`, {method: 'POST'})
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
            kluda(0);
        } else {
            izvadesDati = data;
            
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
            bultuVeidosana(0);
            bultuParbaude(0);
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

//Veido seriālu kartiņas
function serialaVeidosana(data, i) {
    //Šis divs ir kaste kas iekļauj visus seriālus
    serialuKaste = document.getElementById('serialiem');
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
    if(data[i].sfavourite == 1) {
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
    document.getElementById('serialuIzvade').style.display = 'flex';

    //Pievieno funkcijas elementiem pēc to izveidošanas
    zvaigzne.addEventListener('click', (iecienit));
    logo.addEventListener("click", (serialaEpizodes));
}

//Izveido epizodes kartiņas
function epizodesVeidosana(data, i) {
    //Šis divs ir kaste kas iekļauj visas epizodes
    epizozuKaste = document.getElementById('epizodem');

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
    epizozuKaste.appendChild(epizodesKarte);
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

    document.getElementById('epizozuIzvade').style.display = 'flex';
    document.getElementById('epizozuIzvade').classList.remove('bg-danger');
    document.getElementById('epizodem').classList.remove('bg-danger');
}

//Padara epizodi vai seriālu par mīļāko, lai to varētu ātrāk atrast
function iecienit() {
    if (user_id != 0) {
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
                    izvadesDati[i].sfavourite = 0;
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
                    izvadesDati[i].sfavourite = 1;
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
        fetch(`/iecienit?iecienit=${f}&epizodesID=${this.dataset.epizode}&user=${user_id}`, {method: 'POST'})
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
        fetch(`/iecienit?iecienit=${f}&serialaID=${this.dataset.serials}&user=${user_id}`, {method: 'POST'})
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
    } else {
        kluda(5);
    }
}

//Pārbauda vai bultiņām jāizskatās uzspiežamām
function bultuParbaude(iemesls) {
    //Nulletajā lapā kreisā bultiņa nekad neizskatīsies spiežama, bet citās lapās vislaik izskatīsies spiežama
    if ((iemesls == 0 || iemesls == 2)) { //Epizodes
        if (epizozuLapa == 0) {
            bultuMainas(document.getElementsByClassName('fa-caret-square-left'), false, false);
        } else {
            bultuMainas(document.getElementsByClassName('fa-caret-square-left'), true, false);
        }
        //Ja nākošajā lapā atrodas vismas viena epizode, tad labā bultiņa izskatās uzspiežama
        if (((izvadesDati.length - (((epizozuLapa+1)*6))) > 0)) {
            bultuMainas(document.getElementsByClassName('fa-caret-square-right'), true, false);
        } else {
            bultuMainas(document.getElementsByClassName('fa-caret-square-right'), false, false);
        }
    }
    if ((iemesls == 1 || iemesls == 2)) { //Seriāli
    //Tas pats ar seriāliem
        if (serialuLapa == 0) {
            bultuMainas(document.getElementsByClassName('fa-caret-square-left'), false, true);
        } else {
            bultuMainas(document.getElementsByClassName('fa-caret-square-left'), true, true);
        }
        //Tas pats ar seriāliem
        if (((serialuDati.length - (((serialuLapa+1)*6))) > 0)) {
            bultuMainas(document.getElementsByClassName('fa-caret-square-right'), true, true);
        } else {
            bultuMainas(document.getElementsByClassName('fa-caret-square-right'), false, true);
        }
    }
}

function bultuMainas(bultas, spiezams, serials) {
    if (bultas.length == 2) {
            bultas[0] = bultasMaina(bultas[0],spiezams)
            bultas[1] = bultasMaina(bultas[1],spiezams)
    } else if (bultas.length > 2) {
        if (serials) { //true = seriāli, false = epizodes
            bultas[0] = bultasMaina(bultas[0],spiezams)
            bultas[1] = bultasMaina(bultas[1],spiezams)
        } else {
            bultas[2] = bultasMaina(bultas[2],spiezams)
            bultas[3] = bultasMaina(bultas[3],spiezams)
        }
    }
}

function bultasMaina(bulta, spiezams) {
    if (spiezams) {
        //Pievieno bultas pildījumu
        bulta.classList.add('fas');
        //Noņem bultas kontūru
        bulta.classList.remove('far');
        //Pelīte nerāda ka varētu spiest uz pogas
        bulta.style.cursor = 'pointer';
    } else {
        //Pievieno bultas pildījumu
        bulta.classList.remove('fas');
        //Noņem bultas kontūru
        bulta.classList.add('far');
        //Pelīte nerāda ka varētu spiest uz pogas
        bulta.style.cursor = 'initial';
    }
    return bulta;
}

//Nodrošina to kā tiek izvadītas citas lapas uzspiežot uz bultiņām
function epizozuLapasMaina(virz) {
    if (debug) console.log(epizozuLapa);
    if (debug) console.log((izvadesDati.length - (((epizozuLapa+1)*6))));
    //Pārbauda kurā virzienā rāda poga
    if (virz == 'l'){
        //Ja nākošā lapā ir vēl 6 vai vairāk epizodes, tad tiek izvadītas 6 epizodes, citādi ja nākošā lapā epizožu skaits ir mazāk par 6, tad izvada visas palikušās epizodes un ne vairāk, ja vairs nav epizožu tad nekas nenotiek
        if ((izvadesDati.length - (((epizozuLapa+1)*6))) >= 6) {
            epizozuLapa++;
            document.getElementById('epizodem').innerHTML = '';
        for (let i = epizozuLapa*6; i < (epizozuLapa+1)*6; i++) {
            epizodesVeidosana(izvadesDati, i);
        }
        } else if (((izvadesDati.length - (((epizozuLapa+1)*6))) < 6) && (izvadesDati.length - (((epizozuLapa+1)*6))) > 0) {
            epizozuLapa++;
            document.getElementById('epizodem').innerHTML = '';
            for (let i = epizozuLapa*6; i < izvadesDati.length; i++) {
                epizodesVeidosana(izvadesDati, i);
            }
        }
    } else if (virz == 'k') {
        //Ja pagaišās lapas sākuma ID nav mazāks par 0, tad izvada 6 iepriekšējās epizodes
        if ((epizozuLapa-1)*6  >= 0) {
            epizozuLapa--;
            document.getElementById('epizodem').innerHTML = '';
        for (let i = epizozuLapa*6; i < (epizozuLapa+1)*6; i++) {
            epizodesVeidosana(izvadesDati, i);
        }
        }
    }
    //Pārbauda vai bultiņām jāizskatās uzspiežamām
    bultuParbaude(0);
}

function serialuLapasMaina(virz) {
    let serialuIDs = [];
    dati = [];
    for (let i = 0; i < serialuDati.length; i++) {
        if (!serialuIDs.includes(serialuDati[i].show_id)) {
            serialuIDs.push(serialuDati[i].show_id);
            dati.push(serialuDati[i]);
        }
    }
    serialuDati = dati;
    if (virz == 'l'){
        //Ja nākošā lapā ir vēl 6 vai vairāk epizodes, tad tiek izvadītas 6 epizodes, citādi ja nākošā lapā epizožu skaits ir mazāk par 6, tad izvada visas palikušās epizodes un ne vairāk, ja vairs nav epizožu tad nekas nenotiek
        if ((serialuDati.length - (((serialuLapa+1)*6))) >= 6) {
            serialuLapa++;
            document.getElementById('serialiem').innerHTML = '';
            for (let i = serialuLapa*6; i < (serialuLapa+1)*6; i++) {
                serialaVeidosana(serialuDati, i);
            }
        } else if (((serialuDati.length - (((serialuLapa+1)*6))) < 6) && (serialuDati.length - (((serialuLapa+1)*6))) > 0) {
            serialuLapa++;
            document.getElementById('serialiem').innerHTML = '';
            for (let i = serialuLapa*6; i < serialuDati.length; i++) {
                serialaVeidosana(serialuDati, i);
            }
        }
    } else if (virz == 'k') {
        //Ja pagaišās lapas sākuma ID nav mazāks par 0, tad izvada 6 iepriekšējās epizodes
        if ((serialuLapa-1)*6  >= 0) {
            serialuLapa--;
            document.getElementById('serialiem').innerHTML = '';
        for (let i = serialuLapa*6; i < (serialuLapa+1)*6; i++) {
            serialaVeidosana(serialuDati, i);
        }
        }
    }
    bultuParbaude(1);
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

        document.getElementById('serialiem').style.backgroundColor = '#363'
        document.getElementById('epizodem').style.backgroundColor = '#363'
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
        document.getElementById('serialiem').style.backgroundColor = '#7c7'
        document.getElementById('epizodem').style.backgroundColor = '#7c7'
        //Pievieno katrai bildei vieglu caurspīdīgu fonu priekš kontrasta
        for (let i = 0; i < document.getElementsByClassName('logo').length; i++) {
            document.getElementsByClassName('logo')[i].style.background = '#00000010';
        }
        localStorage.setItem('krasa','gaišs');
    }
}

function iztirit() {
    epizozuLapa = 0;
    serialuLapa = 0;
    document.getElementById('serialuIzvade').style.display = 'none';
    document.getElementById('epizozuIzvade').style.display = 'none';

    document.getElementById('epizozuIzvade').classList.remove('bg-danger','bg-warning');
    document.getElementById('epizodem').classList.remove('bg-danger','bg-warning');

    document.getElementById('serialuAugsejasBultas').innerHTML = '';
    document.getElementById('serialiem').innerHTML = '';
    document.getElementById('serialuApaksejasBultas').innerHTML = '';

    document.getElementById('epizozuAugsejasBultas').innerHTML = '';
    document.getElementById('epizodem').innerHTML = '';
    document.getElementById('epizozuApaksejasBultas').innerHTML = '';
}

function sriftaMaina(srifts) {
    if (user_id != 0) {
    fetch(`/iestatijumi?user=${user_id}&font=${srifts}`, {method: 'POST'})
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
    body = document.getElementById('body');
    body.className = '';
    body.classList.add(srifts);
}

function krasasMaina(krasa) {
    if (user_id != 0) {
    fetch(`/iestatijumi?user=${user_id}&theme=${krasa}`, {method: 'POST'})
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
    if (krasa == 'tumšs') {
        tumsaisRezims(true);
    } else {
        tumsaisRezims(false);
    }
}

function iestatijumi() {
    if (user_id != 0) {
    fetch(`/iestatijumi?user=${user_id}`, {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        if (data[0] === undefined) {
            nosacijumaIestatijumi();
        } else {
            krasasMaina(data[0].theme);
            sriftaMaina(data[0].font);
        }
    })
    .catch(function(error) {
        console.log(error);
    });
    } else {
        nosacijumaIestatijumi();
    }
}

function sakums() {
    if (user_id == null) user_id = 0;
    cepumaLogin();
    visiSeriali();
    iestatijumi();
}

function nosacijumaIestatijumi() {
    krasasMaina('gaišs');
    sriftaMaina('helvetica');
}

document.getElementById('login').addEventListener('click', () => {
    let lietotajVards = document.getElementById('logLietotajVards').value;
    let parole = document.getElementById('logParole').value;
    fetch(`/login?lietotajVards=${lietotajVards}&parole=${parole}`, {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        if (data[0] === undefined) {
            kluda(4);
        } else {
            user_id = data[0].user_id;
            fetch(`/cepumaVeidosana?user=${user_id}`, {method: 'POST'})
            .then(function(response) {
                if(response.ok) {
                    return;
                } 
                throw new Error('Request failed.');
            })
            .catch(function(error) {
                console.log(error);
            })
            fetch(`/cepumaSanemsana`, {method: 'GET'})
            .then(function(response) {
                if(response.ok) {
                    return;
                } 
                throw new Error('Request failed.');
            })
            .catch(function(error) {
                console.log(error);
            })
            sakums();
        }
    })
    .catch(function(error) {
        console.log(error);
    });
});

function cepumaLogin() {
    fetch(`/cepumaSanemsana`, {method: 'GET'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        user_id = data.cepums;
        visiSeriali();
        iestatijumi();
    })
    .catch(function(error) {
        console.log(error);
    })
}

document.getElementById('register').addEventListener('click', () => {
    let lietotajVards = document.getElementById('regLietotajVards').value;
    let parole = document.getElementById('regParole').value;
    fetch(`/register?lietotajVards=${lietotajVards}&parole=${parole}`, {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } 
        throw new Error('Request failed.');
    })
    .then(function(data) {
        if (data[0] === undefined) {
            sakums();
            izvadesDati = [];
            iztirit();
            document.getElementById('epizozuIzvade').style.display = 'flex';
            let kludasKaste = document.createElement("div");
            document.getElementById("epizodem").appendChild(kludasKaste);
            kludasKaste.classList.add('output-inside')
            let teksts = document.createElement('p');
            kludasKaste.appendChild(teksts);
            teksts.innerHTML = 'Jūs veiksmīgi piereģistrējāties!.'; 
        } else {
            kluda(6);
        }
    })
    .catch(function(error) {
        console.log(error);
    });
});

/*
function zetonaVeidosana() {
    let uuid = self.crypto.randomUUID();
    console.log(uuid);
}
*/

sakums();