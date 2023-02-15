// lista oiba svih clanova,
// da je lakše doći do info ako se oibovi ponavljaju
var clanoviOIBLista = [];

// lista svih clanova
// da ne moram svaki puta inicijalizirati funkciju za citanje
// iz firebase i ponovno pohranjivati podatke
var clanovi;
let odbor;
const oneYear = 31536000000;
const oneMonth = 2678400000;
const oneDay = 86400000;

clanoviRef.on('value', function (oOdgovorPosluzitelja) {
    let tablica = $("#clanoviIspis > tbody");
    tablica.empty();
    let Rbr = 0;
    clanoviOIBLista = [];
    clanovi = [];
    // petlja kroz pojedin clan udruge
    oOdgovorPosluzitelja.forEach(function (oClanSnapshot) {
        let clanKey = oClanSnapshot.key; // ključ
        clanovi[clanKey] = oClanSnapshot.val();

        clanoviOIBLista.push(oClanSnapshot.val().oib);
        //  da se može otvoriti modal s sportovima
        let sportTablica = "";
        for (const prop in oClanSnapshot.val().sportovi) {
            if (oClanSnapshot.val().sportovi[prop] === true)
                sportTablica += (`<li>${prop}</li>`);
        }
        if (oClanSnapshot.val().status === true) {
            let dateOfLastPayment = Object.keys(clanovi[clanKey].uplate)[Object.keys(clanovi[clanKey].uplate).length - 1].toString();
            let dif = ((parseInt(dateOfLastPayment) + oneMonth) - new Date().getTime())
            let daysDifference = Math.floor((dif / 1000) / 60 / 60 / 24);
            if (daysDifference < 0) {
                clanovi[clanKey].status = false;
                oDb.ref(`SportskaUdruga/clanovi/${clanKey}`).update({ 'status': false })
                tablica.empty();
            }
            // console.log(daysDifference)
            tablica.append(
                `<tr>
            <td>${++Rbr}</td>
            <td>${oClanSnapshot.val().ime}</td>
            <td>${oClanSnapshot.val().prezime}</td>
            <td><ul class='unutranjaTablica'>${sportTablica}</ul></td>
            <td><button class="button addButton text-center align-middle" onclick="EditMember('${clanKey}')">UREDI</button></td>
            <td><button class="button text-center align-middle" onclick="DeleteMember('${clanKey}')">&times;</button></td>
            <td><button class="button text-center align-middle" onclick="Membership('${clanKey}')">Uplati eure</button></td>
            </tr>`);
            // console.log(typeof oClanSnapshot.val().sportovi)
        }
        else {
            tablica.append(
                `<tr class="inactive">
            <td>${++Rbr}</td>
            <td>${oClanSnapshot.val().ime}</td>
            <td>${oClanSnapshot.val().prezime}</td>
            <td><ul class='unutranjaTablica'>${sportTablica}</ul></td>
            <td><button class="button addButton text-center align-middle" onclick="EditMember('${clanKey}')">UREDI</button></td>
            <td></td>
            <td><button class="button text-center align-middle red" onclick="PayCash('${clanKey}')">Uplati eure</button></td>
            </tr>`);
            // <td><button class="button text-center align-middle"onclick="DeleteMember('${clanKey}')">&times;</button></td>
        }
    })
});
izvrsniOdborRef.on('value', function (odgovor) {
    izvrsniOdbor = {};
    odgovor.forEach(function (clanOdbora) {
        clanoviRef.on('value', function (OdgovorPosluzitelja) {
            OdgovorPosluzitelja.forEach(function (clanSnapshot) {
                if (clanSnapshot.key === clanOdbora.key)
                    // izvrsniOdbor[clanOdbora.key] = oClanSnapshot.val();
                    if ((clanOdbora.val() + oneYear) > new Date().getTime()) {
                        izvrsniOdbor[clanOdbora.key] = {
                            'ime': clanSnapshot.val().ime,
                            'prezime': clanSnapshot.val().prezime,
                            'oib': clanSnapshot.val().oib,
                            'sportovi': clanSnapshot.val().sportovi,
                            'status': clanSnapshot.val().status,
                            'pocetakMandata': clanOdbora.val()
                        }
                        // console.log(new Date().getTime() - clanOdbora.val() > oneYear)
                    }
                    else RemoveCouncilMember('izvrsniOdbor', clanOdbora.key)
                // kraj-pocetak = delta ako je veća razlika od godine gotovo je sve 
            })
        })
    })
})

function Membership(memKey) {
    let dateOfLastPayment = Object.keys(clanovi[memKey].uplate)[Object.keys(clanovi[memKey].uplate).length - 1].toString();
    let dif = ((parseInt(dateOfLastPayment) + oneMonth) - new Date().getTime())
    let daysDifference = Math.floor((dif / 1000) / 60 / 60 / 24);
    if (daysDifference < 0) document.getElementById('clanarinaModalText').textContent = 'Članstvo je isteklo';
    else document.getElementById('clanarinaModalText').textContent = 'preostalo dana clanstva: ' + daysDifference;
    document.querySelector('#UpdateMembership').setAttribute('onclick', `PayCash('${memKey}')`)
    $('#clanarinaModal').modal('show');
}

function PayCash(memberKey) {
    //  funkcija omogucava da clan 'plati' svoje članstvo koje vrijedi 30 dana
    let uplate = oDb.ref(`SportskaUdruga/clanovi/${memberKey}/uplate`);
    let tajclan = {
        // [new Date().toISOString().substring(0,10)]: true
        [new Date().getTime().toString()]: true

    }
    uplate.update(tajclan);
    oDb.ref(`SportskaUdruga/clanovi/${memberKey}`).update({ 'status': true });
    document.getElementById('clanarinaModalText').textContent = 'Preostalo dana clanstva: ' + '31';
}

function AddMemberModal() {
    $('#addMemberName').val('');
    $('#addMemberLastName').val('');
    $('#addMemberOIB').val('');

    //  postavljanje odabira mogućih sportova za koje se član može interesirati
    let sportoviOptions = document.getElementById("addMemberFormCheckbox");
    sportoviOptions.innerHTML = "";
    sportoviRef.once('value', function (oOdgovorPosluzitelja2) {
        let lSportova = oOdgovorPosluzitelja2.val();
        for (const sport in lSportova) {
            sportoviOptions.innerHTML += `
            <div class="form-container">
            <input type="checkbox" class="inpt-ch-box" name="${sport}" value="${sport}" id="inpt${sport}"></input>
            <span>${sport}:</span>
            </div>`;
        }
    });
    $('#addModal').modal('show');
}

function AddMember() {
    //  dozivanje vrijednosti iz forme za dodavanje novog clana udruge
    let clanIme = $('#addMemberName').val();
    let clanPrezime = $('#addMemberLastName').val();
    let clanOIB = $('#addMemberOIB').val();

    //  provjera sadrzaja imena, sadrze li brojeve u imenu ili prezimenu
    if (/\d/.test(clanIme) || /\d/.test(clanPrezime) || clanIme.length < 3 || clanPrezime.length < 3) {
        document.getElementById('warningModalText').textContent = 'Ime ili prezime je neispravnog formata.';
        $('#warningModal').modal('show');
        return;
    }
    var myNodeList = document.querySelectorAll(".inpt-ch-box");
    let allSports = {};
    let oneSportMinimum = false;

    //  provjera da su svi checkbox-ovi uvazeni
    // console.log('broj u listi koja je vidljiva: ' + myNodeList.length)

    for (let index = 0; index < myNodeList.length; index++) {
        allSports[myNodeList[index].name] = myNodeList[index].checked;
        if (allSports[myNodeList[index].name] === true)
            oneSportMinimum = true;
    }
    // provjera svakog sporta, da je svaka vrijednost ispravno pridruzena
    // for (const sport in allSports) {
    //     console.log(`${sport}: ` + allSports[sport])
    // }

    //  provjera da je odabran barem jedan sport za clana udruge
    if (oneSportMinimum === false) {
        document.getElementById('warningModalText').textContent = 'Nije odabran niti jedan sport od odabira.';
        $('#warningModal').modal('show');
        return;
    }

    //  provjera postoji li vec clan s tim oib-om,
    //  ako postoji onda mijenjamo vrijednost var
    let postojiIstiOIB = false;

    //  provjera ako je uneseni oib ispravnog formata
    //console.log(typeof oib)
    if (isNaN(clanOIB)) {
        document.getElementById('warningModalText').textContent = 'Unesena vrijednost je neispravnog formata.';
        $('#warningModal').modal('show');
        // alert('is string.')
        return;
    }
    else if (clanOIB.length != 11) {
        document.getElementById('warningModalText').textContent = 'Neispravan broj znakova, OIB se sastoji od 11 brojeva';
        $('#warningModal').modal('show');
        //alert('wrong length.')
        return;
    }
    // else {
    //     console.log('new member basic info is valid.')
    // }

    clanoviOIBLista.forEach(clanovOIB => {
        if (clanOIB === clanovOIB) {
            document.getElementById('warningModalText').textContent = 'Vec postoji registrirana osoba s tim OIB-om.';
            $('#warningModal').modal('show');
            // alert('vec postoji registrirana osoba s tim oibom');
            // console.log('vec postoji registrirana osoba s tim oibom');
            postojiIstiOIB = true;
        }
    })
    if (postojiIstiOIB === false) {
        // Kreiranje novoga ključa u bazi
        let sKey = clanoviRef.push().key;

        //  ako cu postaviti oib kao kljuc
        //  let sKey = $('#addMemberOIB').val();

        let tajClan =
        {
            'ime': clanIme,
            'prezime': clanPrezime,
            'oib': clanOIB,
            'sportovi': allSports,
            'status': true,
            'uplate': {
                [new Date().getTime()]: true
            }
        };
        // Zapiši u Firebase
        let oZapis = {};
        oZapis[sKey] = tajClan;
        clanoviRef.update(oZapis);
        // document.location.reload();
        $('#addModal').modal('hide')
    }
}

//  brisanje clana iz baze
function DeleteMember(clanKey) {
    let clanRef = oDb.ref('SportskaUdruga/clanovi/' + String(clanKey));
    // let statusRef = oDb.ref('SportskaUdruga/clanovi/' + String(clanKey) + '/status')
    let tajClan;
    if (clanovi[clanKey].status === true)
        tajClan = { 'status': false }
    else
        tajClan = { 'status': true };
    // clanRef.remove();
    clanRef.update(tajClan);
}
// function DeleteMemberModal(clanKey){
//     $('#warningModal').modal('show');
// }

//  funkcija za uredivanje odabranog clana
function EditMember(clanKey) {
    let clanRef = oDb.ref('SportskaUdruga/clanovi/' + String(clanKey)); // odabrana vijest
    clanRef.once('value', function (oOdgovorPosluzitelja) {
        let tajClan = oOdgovorPosluzitelja.val();
        // Popunjavanje elemenata forme za uređivanje
        $('#editMemberName').val(tajClan.ime);
        $('#editMemberLastName').val(tajClan.prezime);

        //  dohvacanje svih sportova
        let opcije = document.getElementById("sportovi");
        opcije.innerHTML = "";

        //  postavljanje svih sportova u bazi
        sportoviRef.once('value', function (oOdgovorPosluzitelja2) {
            let lSportova = oOdgovorPosluzitelja2.val();
            for (const sport in lSportova) {
                //  provjera ako clanovi ne sadrze taj sport
                //  ako ne mogu jednostavno dodati C:
                if (Object.hasOwn(tajClan.sportovi, sport) === false)
                    opcije.innerHTML += `
                    <div class="form-container">
                    <input type="checkbox" class="ch-box"name="${sport}" value="${sport}" id="${sport}"></input>
                    <span>${sport}</span>
                    </div>`;
                for (const sport2 in tajClan.sportovi) {
                    if (Object.hasOwn(lSportova, sport2) === true) {
                        if (sport == sport2 && tajClan.sportovi[sport2] === false)
                            opcije.innerHTML += `
                            <div class="form-container">
                            <input type="checkbox" class="ch-box"name="${sport}" value="${sport}" id="${sport}"></input>
                            <span>${sport}</span>
                            </div>`;
                        else if (sport == sport2)
                            opcije.innerHTML += `
                            <div class="form-container">
                            <input checked type="checkbox" class="ch-box"name="${sport}" value="${sport}" id="${sport}"></input>
                            <span>${sport}</span>
                            </div>`;
                    }
                }
                //  console.log(sport);
            }
        })
        // console.log(tajClan)

        // Dodavanje događaja na gumb -why-
        $('#editPohrani').attr('onclick', `SpremiClana('${clanKey}')`);
        // Prikaži modal
        $('#editModal').modal('show');
    });
}

//  funkcija za spremanje uredivanog clana
function SpremiClana(clanKey) {
    //  console.log(`spremio sam ${clanKey}`)
    let clanRef = oDb.ref('SportskaUdruga/clanovi/' + String(clanKey));
    let clanIme = $('#editMemberName').val();
    let clanPrezime = $('#editMemberLastName').val();

    let myNodeList = document.querySelectorAll(".ch-box");
    let allSports = {};

    // console.log('broj u listi koja je vidljiva: ' + myNodeList.length)

    for (let index = 0; index < myNodeList.length; index++) {
        allSports[myNodeList[index].name] = myNodeList[index].checked;
    }

    // for (const sport in allSports) {
    //     console.log(`${sport}: ` + allSports[sport])
    // }

    let tajClan =
    {
        'ime': clanIme,
        'prezime': clanPrezime,
        'sportovi': allSports
    };
    clanRef.update(tajClan);
    $('#editModal').modal('hide');
}
//  modal za dodavanje sportova
function AddSportModal() {
    let opcije = document.getElementById("addSportForm");
    opcije.innerHTML = "";
    sportoviRef.once('value', function (oOdgovorPosluzitelja2) {
        let lSportova = oOdgovorPosluzitelja2.val();
        for (const sport in lSportova) {
            document.getElementById("addSportForm").innerHTML += `
                    <div class="form-container">
                    <input type="checkbox" checked class="addSport-ch-box" name="${sport}" value="${sport}" id="${sport}"></input>
                    <span>${sport}</span>
                    </div>`;
        }
        opcije.innerHTML += `
                <hr id="addSportButton"><button type="button" class="button" onclick="AddSport()">dodaj</button>`;
    });
    document.querySelector('#sportButton').setAttribute('onclick', 'EditSport()')
    $('#addSportModal').modal('show');
}
//  dodavanje sportova u listu
function AddSport() {
    let temp = document.querySelector("#inputSport");
    if(typeof(temp) != 'undefined' && temp != null){
        temp.remove();
    }
    $("#addSportForm").append(`
    <div class="form-container" id="inputSport">
        <label for="theSportIWantToAdd">Ime sporta kojeg želite dodati: 
            <input type="text" name="theSportIWantToAdd" id="theSportIWantToAdd"></input>
        </label>
    </div>
    `);
    document.querySelector('#sportButton').setAttribute('onclick', 'AddSportConfirm()')
}

//  zapravo dodavanje sportova u listu sportova
function AddSportConfirm() {
    let zapis = {};
    let sport = document.querySelector('#theSportIWantToAdd').value;
    zapis[sport] = true;
    oDb.ref('SportskaUdruga/sportovi/').update(zapis);

    $(`<div class="form-container">
    <input type="checkbox" checked class="addSport-ch-box" name="${sport}" value="${sport}" id="${sport}"></input>
    <span>${sport}:</span>
    </div>`).insertBefore($("#addSportButton"));

    document.querySelector('#theSportIWantToAdd').value = "";
    document.querySelector('#inputSport').remove();
    document.querySelector('#sportButton').setAttribute('onclick', 'EditSport()')
}
/*
    funkcija za citanje checkbox-ova koji nisu oznaceni,
    odnosno onih sportova koje ne celimo više u udruzi
    prolazi i kroz svaki clan te brise taj sport iz popisa
*/
function EditSport() {
    let sports = document.querySelectorAll('.addSport-ch-box');
    let noSports = {};
    for (let index = 0; index < sports.length; index++) {
        //console.log(sports[index].name + ": " + sports[index].checked)
        if (sports[index].checked == false) {
            noSports[sports[index].name] = false;
            sports[index].parentElement.remove();
        }
    }

    for (const sport in noSports) {
        oDb.ref('SportskaUdruga/sportovi/' + sport).remove();
        for (const clan in clanovi) {
            oDb.ref('SportskaUdruga/clanovi/' + clan + '/sportovi/' + sport).remove();
        }
    }
}

$("#search").keyup(function () {
    let value = document.getElementById("search").value.toLowerCase().trim();
    let indexTD;
    $("#clanoviIspis tr").each(function (index) {
        if (!index) return;
        indexTD = 0;
        $(this).find("td").each(function () {
            if(indexTD <4){
                let id = $(this).text().toLowerCase().trim();
                let not_found = (id.indexOf(value) == -1);
                $(this).closest('tr').toggle(!not_found);
                indexTD++;
                return not_found;
            }
        });
    });
});