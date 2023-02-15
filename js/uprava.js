var clanovi;

var nadzorniOdbor;
var izvrsniOdbor;
var predsjednikUdruge = { 'oib': false };
let vicePresident = { 'oib': false };
let tajnik = { 'oib': false };
let likvidator = { 'oib': false };

const oneYear = 31536000000;
const oneMonth = 2678400000;

clanoviRef.on('value', function (oOdgovorPosluzitelja) {
    clanoviOIBLista = [];
    clanovi = [];
    // petlja kroz pojedin clan udruge
    oOdgovorPosluzitelja.forEach(function (oClanSnapshot) {
        clanovi[oClanSnapshot.key] = oClanSnapshot.val();
        if (oClanSnapshot.val().status === true) {
            let dateOfLastPayment = Object.keys(clanovi[oClanSnapshot.key].uplate)[Object.keys(clanovi[oClanSnapshot.key].uplate).length - 1].toString();
            let dif = ((parseInt(dateOfLastPayment) + oneMonth) - new Date().getTime())
            let daysDifference = Math.floor((dif / 1000) / 60 / 60 / 24);
            if (daysDifference < 0) {
                clanovi[oClanSnapshot.key].status = false;
                oDb.ref(`SportskaUdruga/clanovi/${oClanSnapshot.key}`).update({ 'status': false })
            }
        }
        clanoviOIBLista.push(oClanSnapshot.val().oib);
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

    // console.log(izvrsniOdbor)
    let tablicaIzvrsnogOdbora = $('#tablicaUprava');
    tablicaIzvrsnogOdbora.empty();
    let councilCounter = 0;
    for (const councilMember in izvrsniOdbor) {
        for (const clan in clanovi) {
            if (clan === councilMember) {
                let sportoviTablica = ``;
                for (const sport in clanovi[clan].sportovi) {
                    if (clanovi[clan].sportovi[sport] == true) {
                        sportoviTablica += `<li>${sport}</li>`
                    }
                }
                tablicaIzvrsnogOdbora.append(`
                    <tr>
                        <td>član Izvršnog odbora</td>
                        <td>${clanovi[clan].ime}</td>
                        <td>${clanovi[clan].prezime}</td>
                        <td><ul>${sportoviTablica}</ul></td>
                        <td><button onclick="RemoveCouncilMemberModal('izvrsniOdbor','${clan}')">delete</button></td>
                    </tr>`
                )
                councilCounter++;
                // return;
                break;
            }
        }
    }
    if (councilCounter < 5) {
        for (councilCounter; councilCounter < 5; councilCounter++) {
            tablicaIzvrsnogOdbora.append(`
                    <tr>
                        <td>slobodna pozicija</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><button onclick="AddCouncilMemberModal('izvrsniOdbor')">Appoint member</button></td>
                    </tr>`
            )
        }
    }
});

nadzorniOdborRef.on('value', function (odgovor) {
    nadzorniOdbor = {};
    odgovor.forEach(function (clanOdbora) {
        clanoviRef.on('value', function (OdgovorPosluzitelja) {
            OdgovorPosluzitelja.forEach(function (clanSnapshot) {
                if (clanSnapshot.key === clanOdbora.key)
                    // nadzorniOdbor[clanOdbora.key] = clanSnapshot.val();
                    if ((clanOdbora.val() + oneYear) > new Date().getTime()) {
                        nadzorniOdbor[clanOdbora.key] = {
                            'ime': clanSnapshot.val().ime,
                            'prezime': clanSnapshot.val().prezime,
                            'oib': clanSnapshot.val().oib,
                            'sportovi': clanSnapshot.val().sportovi,
                            'status': clanSnapshot.val().status,
                            'pocetakMandata': clanOdbora.val()
                        }
                    } else RemoveCouncilMember('nadzorniOdbor', clanOdbora.key)
            })
        })
        // console.log(clanOdbora.val())
    })

    // console.log(nadzorniOdbor)
    let tablicaNadzorniOdbor = $('#tablicaNadzorniOdbor');
    tablicaNadzorniOdbor.empty();
    let councilCounter = 0;
    for (const councilMember in nadzorniOdbor) {
        for (const clan in clanovi) {
            if (clan === councilMember) {
                let sportoviTablica = ``;
                for (const sport in clanovi[clan].sportovi) {
                    if (clanovi[clan].sportovi[sport] == true) {
                        sportoviTablica += `<li>${sport}</li>`
                    }
                }

                //console.log(nadzorniOdbor)
                tablicaNadzorniOdbor.append(`
                    <tr>
                        <td>član Izvršnog odbora</td>
                        <td>${clanovi[clan].ime}</td>
                        <td>${clanovi[clan].prezime}</td>
                        <td><ul>${sportoviTablica}</ul></td>
                        <td><button onclick="RemoveCouncilMemberModal('nadzorniOdbor','${clan}')">delete</button></td>
                    </tr>`
                )
                councilCounter++;
                // return;
                break;
            }
        }
    }
    if (councilCounter < 3) {
        for (councilCounter; councilCounter < 3; councilCounter++) {
            tablicaNadzorniOdbor.append(`
                    <tr>
                        <td>slobodna pozicija</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><button onclick="AddCouncilMemberModal('nadzorniOdbor')">Appoint member</button></td>
                    </tr>`
            )
        }
    }
});

predsjednikRef.on('value', function (odgovor) {
    predsjednikUdruge = { 'oib': false };
    odgovor.forEach(function (p) {
        clanoviRef.on('value', function (OdgovorPosluzitelja) {
            OdgovorPosluzitelja.forEach(function (clanSnapshot) {
                if (clanSnapshot.key === p.key)
                    // if (new Date().getTime() - p.val() > oneYear){
                        // predsjednikUdruge[p.key] = clanSnapshot.val();
                        predsjednikUdruge = {
                            'ime': clanSnapshot.val().ime,
                            'prezime': clanSnapshot.val().prezime,
                            'oib': clanSnapshot.val().oib,
                            'sportovi': clanSnapshot.val().sportovi,
                            'status': clanSnapshot.val().status,
                            'key': p.key
                    }
                // } else RemoveCouncilMember(councilType, key) // treba druga funkcija
            })
        })
    })
    if (predsjednikUdruge.oib === false) {
        $('#presidentList').empty();
        $('#presidentList').append(`
        <li><button type="button" class="button" onclick="AppointImportantPersonModal('predsjednik', 'none')">Postavi predsjednika</button></li>`);
    }
    else {
        for (const member in clanovi) {
            // for (const predsjednik in predsjednikUdruge) {
            if (predsjednikUdruge.key === member) {
                // console.log(clanovi[member])
                $('#presidentList').empty();
                $('#presidentList').append(`
                <li>PREDSJEDNIK</li>
            <li>${clanovi[member].ime} ${clanovi[member].prezime}</li>
            <li><button type="button" class="button" onclick="AppointImportantPersonModal('predsjednik', '${predsjednikUdruge.key}')">POSTAVI</button></li>
            <li><button type="button" class="button" onclick="RemoveCouncilMemberModal('predsjednik', '${predsjednikUdruge.key}')">UKLONI</button></li>
        `);
            }
            // }
        }
    }
});

vicePresidentRef.on('value', function (odgovor) {
    vicePresident = { 'oib': false };
    odgovor.forEach(function (vp) {
        clanoviRef.on('value', function (OdgovorPosluzitelja) {
            OdgovorPosluzitelja.forEach(function (clanSnapshot) {
                if (clanSnapshot.key === vp.key) {
                        vicePresident = {
                            'ime': clanSnapshot.val().ime,
                            'prezime': clanSnapshot.val().prezime,
                            'oib': clanSnapshot.val().oib,
                            'sportovi': clanSnapshot.val().sportovi,
                            'status': clanSnapshot.val().status,
                            'key': vp.key
                    }
                }
            })
        })
    })
    if (vicePresident.oib === false) {
        $('#vicePresidentList').empty();
        $('#vicePresidentList').append(`
        <li>PODPREDSJEDNIK</li>
        <li><button type="button" class="button" onclick="AppointImportantPersonModal('podpredsjednik', 'none')">POSTAVI</button></li>
        `);
    }
    else {
        $('#vicePresidentList').empty();
        $('#vicePresidentList').append(`
        <li>PODPREDSJEDNIK</li>
        <li>${vicePresident.ime} ${vicePresident.prezime}</li>
        <li><button type="button" class="button" onclick="AppointImportantPersonModal('podpredsjednik', '${vicePresident.key}')">POSTAVI</button></li>
        <li><button type="button" class="button" onclick="RemoveCouncilMemberModal('podpredsjednik', '${vicePresident.key}')">UKLONI</button></li>
        `);
    }
})

tajnikRef.on('value', function (odgovor) {
    tajnik = { 'oib': false };
    odgovor.forEach(function (t) {
        clanoviRef.on('value', function (OdgovorPosluzitelja) {
            OdgovorPosluzitelja.forEach(function (clanSnapshot) {
                if (clanSnapshot.key === t.key) {
                        tajnik = {
                            'ime': clanSnapshot.val().ime,
                            'prezime': clanSnapshot.val().prezime,
                            'oib': clanSnapshot.val().oib,
                            'sportovi': clanSnapshot.val().sportovi,
                            'status': clanSnapshot.val().status,
                            'key': t.key
                    }
                }
            })
        })
    })
    if (tajnik.oib == false) {
        $('#tajnikList').empty();
        $('#tajnikList').append(`
        <li>TAJNIK</li>
        <li><button type="button" class="button" onclick="AppointImportantPersonModal('tajnik', 'none')">POSTAVI</button></li>
        `);
    }
    else {
        $('#tajnikList').empty();
        $('#tajnikList').append(`
        <li>TAJNIK</li>
        <li>${tajnik.ime} ${tajnik.prezime}</li>
        <li><button type="button" class="button" onclick="AppointImportantPersonModal('tajnik', '${tajnik.key}')">POSTAVI</button></li>
        <li><button type="button" class="button" onclick="RemoveCouncilMemberModal('tajnik', '${tajnik.key}')">UKLONI</button></li>
        `);
    }
})

likvidatorRef.on('value', function (odgovor) {
    likvidator = { 'oib': false };
    odgovor.forEach(function (l) {
        clanoviRef.on('value', function (OdgovorPosluzitelja) {
            OdgovorPosluzitelja.forEach(function (clanSnapshot) {
                if (clanSnapshot.key === l.key) {
                        likvidator = {
                            'ime': clanSnapshot.val().ime,
                            'prezime': clanSnapshot.val().prezime,
                            'oib': clanSnapshot.val().oib,
                            'sportovi': clanSnapshot.val().sportovi,
                            'status': clanSnapshot.val().status,
                            'key': l.key
                }
                }
            })
        })
        })
        if (likvidator.oib == false) {
            $('#likvidatorList').empty();
            $('#likvidatorList').append(`
        <li>LIKVIDATOR</li>
        <li><button type="button" class="button" onclick="AppointImportantPersonModal('likvidator', 'none')">POSTAVI</button></li>
        `);
        }
        else {
            $('#likvidatorList').empty();
            $('#likvidatorList').append(`
        <li>TAJNIK</li>
        <li>${likvidator.ime} ${likvidator.prezime}</li>
        <li><button type="button" class="button" onclick="AppointImportantPersonModal('likvidator', '${likvidator.key}')">POSTAVI</button></li>
        <li><button type="button" class="button" onclick="RemoveCouncilMemberModal('likvidator', '${likvidator.key}')">UKLONI</button></li>
        `);
        }
    })

function AppointImportantPersonModal(personFunction, oldImportantPersonKey) {
    $('#upravaAddModalBody').empty();
    for (const clan in clanovi) {
        if (clanovi[clan].status === true)
            if (Object.hasOwn(nadzorniOdbor, clan) == false && Object.hasOwn(izvrsniOdbor, clan) == false
                && clan != oldImportantPersonKey && clan != predsjednikUdruge.key && clan != vicePresident.key && clan != likvidator.key && clan != tajnik.key) {
                $('#upravaAddModalBody').append(`<tr>
                    <td>${clanovi[clan].ime}</td>
                    <td>${clanovi[clan].prezime}</td>
                    <td>
                        <button type="button" class="button btn" onclick="AppointImportantPerson('${personFunction}','${oldImportantPersonKey}', '${clan}')">
                    Odaberi</button>
                    </td>
                </tr>`)
            }
    }
    $('#upravaAddModal').modal('show');
}

function AppointImportantPerson(personFunction, oldImportantPersonKey, newImportantPersonKey) {
    // console.log(clanovi[newImportantPersonKey].ime)
    // console.log(personFunction);
    let importantPersonRef = oDb.ref(`SportskaUdruga/uprava/${personFunction}`);
    let novi = {};
    novi[newImportantPersonKey] = {
        'pocetakMandata': new Date().getTime()
    };
    if (oldImportantPersonKey == "none") {
        $('#upravaAddModal').modal('hide');
        importantPersonRef.update(novi);
        return;
    }
    oDb.ref(`SportskaUdruga/uprava/${personFunction}/${oldImportantPersonKey}`).remove()
    importantPersonRef.update(novi);

    //  history
    let zapis = {};
    let pocetakMandata; // citanje pocetka trajanja mandata
    predsjednikRef.on('value', function (odgovor) {
        odgovor.forEach(function (clanOdbora) {
            pocetakMandata = clanOdbora.val().pocetakMandata;
        })
    })
    zapis[new Date().getTime()] = {
        'pocetakMandata': pocetakMandata,
        [oldImportantPersonKey]: clanovi[oldImportantPersonKey]
    }

    oDb.ref(`SportskaUdruga/povijestUprava/${personFunction}`).update(zapis)
    // oDb.ref(`SportskaUdruga/povijestUprava/${newImportantPersonKey}/pocetakMandata`)
    $('#upravaAddModal').modal('hide');
}

function AddCouncilMemberModal(councilType) {
    $('#upravaAddModalBody').empty();
    // console.log()
    for (const clan in clanovi) {
        if (clanovi[clan].status === true)
            if (councilType === 'nadzorniOdbor') {
                // for(const councilMember in nadzorniOdbor){
                // if(councilMember != clan)
                if (Object.hasOwn(nadzorniOdbor, clan) != true && Object.hasOwn(izvrsniOdbor, clan) === false && predsjednikUdruge.key != clan && clan != vicePresident.key && clan != likvidator.key && clan != tajnik.key) {
                    $('#upravaAddModalBody').append(`<tr>
                            <td>${clanovi[clan].ime}</td>
                            <td>${clanovi[clan].prezime}</td>
                            <td><button type='button' class='button btn' onclick="AddToCouncil('nadzorniOdbor', '${clan}')">Odaberi</button></td>
                            </tr>`)
                    // console.log('idea works.')
                }
                // }
            }
            else if (councilType === 'izvrsniOdbor') {
                if (Object.hasOwn(izvrsniOdbor, clan) != true && Object.hasOwn(nadzorniOdbor, clan) === false && predsjednikUdruge.key != clan && clan != vicePresident.key && clan != likvidator.key && clan != tajnik.key)
                    $('#upravaAddModalBody').append(`<tr>
                        <td>${clanovi[clan].ime}</td>
                        <td>${clanovi[clan].prezime}</td>
                        <td><button type='button' class='btn button' onclick="AddToCouncil('izvrsniOdbor', '${clan}')">Odaberi</button></td>
                        </tr>`)
            }
    }
    $('#upravaAddModal').modal('show');
}

function AddToCouncil(councilType, key) {
    let councilRef = oDb.ref(`SportskaUdruga/uprava/${councilType}`);

    let novi = {};
    novi[key] = new Date().getTime();
    councilRef.update(novi);

    // oDb.ref(`SportskaUdruga/povijestUprava/${councilType}`).update(novi)

    $('#upravaAddModal').modal('hide');
}

function RemoveCouncilMemberModal(councilType, key) {
    upravaEditModalBody.textContent = 'potvrdite brisanje clana';
    $('#upravaEditModal').modal('show');
    $('#saveCouncilChange').attr('onclick', `RemoveCouncilMember('${councilType}','${key}')`)
    // console.log(key)
}

function RemoveCouncilMember(councilType, key) {
    // console.log(`i am editing said member with key: ${key}.`)
    let councilmemRef = oDb.ref(`SportskaUdruga/uprava/${councilType}/${key}`)
    // let clanRef = oDb.ref('SportskaUdruga/clanovi/' + String(clanKey));

    //  history
    let pocetakMandata;
    oDb.ref(`SportskaUdruga/uprava/${councilType}`).on('value', function (odgovor) {
        odgovor.forEach(function (odbornik) {
            if (odbornik.key === key) {
                pocetakMandata = odbornik.val();
                // console.log(pocetakMandata)
            }
        })
    })

    let zapis = {};
    zapis[new Date().getTime()] = {
        'pocetakMandata': pocetakMandata,
        [key]: clanovi[key]
    }
    oDb.ref(`SportskaUdruga/povijestUprava/${councilType}`).update(zapis)

    councilmemRef.remove();
    $('#upravaEditModal').modal('hide');
}

// let last = false;
function IWannaSee(id) {
    if (id === "toggleable") {
        // if(last === true){
        for (let e of document.querySelectorAll('.toggleable'))
            e.style.display = "flex";
        // last = false;
        // }
        // else {
        //     for(let e of document.querySelectorAll('.toggleable')){
        //         e.style.display = "none";
        //     }
        //     last = true;
        // }
        return;
    }
    if (document.getElementById(id.toString()).style.display === "none") {
        // console.log(document.getElementById(id.toString()).style.display)
        document.getElementById(id.toString()).style.display = "flex";
    }
    else {
        // console.log(document.getElementById(id.toString()).style.display)
        document.getElementById(id.toString()).style.display = "none";
    }

}

function HistoryOptionsModal() {
    $('#historyModal').modal('show');
}
oDb.ref('SportskaUdruga/povijestUprava/izvrsniOdbor').on('value', function (odgovor) {
    document.querySelector('#acc1 tbody').innerHTML="";
    odgovor.forEach(function (odbornik) {
        // console.log(odbornik.key);
        // if (odbornik.key != "1") {
        // console.log(odbornik.key)
        // console.log(odbornik.val().pocetakMandata)
        if (Object.keys(odbornik.val())[0] != odbornik.val().pocetakMandata) {
            // console.log(clanovi[Object.keys(odbornik.val())[0]].ime)
            document.querySelector('#acc1 tbody').innerHTML += `
                <tr><td>${clanovi[Object.keys(odbornik.val())[0]].ime} ${clanovi[Object.keys(odbornik.val())[0]].prezime}</td><td>[${new Date(parseInt(odbornik.val().pocetakMandata)).toISOString().substring(0, 10)}] - [${new Date(parseInt(odbornik.key)).toISOString().substring(0, 10)}]</td></tr>
                `;
        }
        else if (Object.keys(odbornik.val())[1] != odbornik.val().pocetakMandata) {
            // console.log(clanovi[Object.keys(odbornik.val())[1]].ime)
            document.querySelector('#acc1 tbody').innerHTML += `
                <tr><td>${clanovi[Object.keys(odbornik.val())[1]].ime} ${clanovi[Object.keys(odbornik.val())[1]].prezime}</td><td>[${new Date(odbornik.val().pocetakMandata).toISOString().substring(0, 10)}] - [${new Date(odbornik.key).toISOString().substring(0, 10)}]</td></tr>
                `;
        }
        // console.log(Object.keys(odbornik.val()))
        // }
    })
})
oDb.ref('SportskaUdruga/povijestUprava/nadzorniOdbor').on('value', function (odgovor) {
    document.querySelector('#acc2 tbody').innerHTML="";
    odgovor.forEach(function (odbornik) {
        // console.log(odbornik.key);
        // if (odbornik.key != "1") {
        // console.log(odbornik.key)
        // console.log(odbornik.val().pocetakMandata)
        if (Object.keys(odbornik.val())[0] != odbornik.val().pocetakMandata) {
            // console.log(clanovi[Object.keys(odbornik.val())[0]].ime)
            document.querySelector('#acc2 tbody').innerHTML += `
                <tr><td>${clanovi[Object.keys(odbornik.val())[0]].ime} ${clanovi[Object.keys(odbornik.val())[0]].prezime}</td><td>[${new Date(parseInt(odbornik.val().pocetakMandata)).toISOString().substring(0, 10)}] - [${new Date(parseInt(odbornik.key)).toISOString().substring(0, 10)}]</td></tr>
                `;
        }
        else if (Object.keys(odbornik.val())[1] != odbornik.val().pocetakMandata) {
            // console.log(clanovi[Object.keys(odbornik.val())[1]].ime)
            document.querySelector('#acc2 tbody').innerHTML += `
                <tr><td>${clanovi[Object.keys(odbornik.val())[1]].ime} ${clanovi[Object.keys(odbornik.val())[1]].prezime}</td><td>[${new Date(odbornik.val().pocetakMandata).toISOString().substring(0, 10)}] - [${new Date(odbornik.key).toISOString().substring(0, 10)}]</td></tr>
                `;
        }
        // console.log(Object.keys(odbornik.val()))
        // }
    })
})

oDb.ref('SportskaUdruga/povijestUprava/predsjednik').on('value', function (odgovor) {
    document.querySelector('#acc3 tbody').innerHTML="";
    odgovor.forEach(function (odbornik) {
        // console.log(odbornik.key);
        // if (odbornik.key != "1") {
        // console.log(odbornik.key)
        // console.log(odbornik.val().pocetakMandata)
        if (Object.keys(odbornik.val())[0] != odbornik.val().pocetakMandata) {
            document.querySelector('#acc3 tbody').innerHTML += `
                <tr><td>${clanovi[Object.keys(odbornik.val())[0]].ime} ${clanovi[Object.keys(odbornik.val())[0]].prezime}</td><td>[${new Date(parseInt(odbornik.val().pocetakMandata.pocetakMandata)).toISOString().substring(0, 10)}] - [${new Date(parseInt(odbornik.key)).toISOString().substring(0, 10)}]</td></tr>
                `;
        }
        else if (Object.keys(odbornik.val())[1] != odbornik.val().pocetakMandata) {
            // console.log(clanovi[Object.keys(odbornik.val())[1]].ime)
            document.querySelector('#acc3 tbody').innerHTML += `
                <tr><td>${clanovi[Object.keys(odbornik.val())[1]].ime} ${clanovi[Object.keys(odbornik.val())[1]].prezime}</td><td>[${new Date(parseInt(odbornik.val().pocetakMandata.pocetakMandata)).toISOString().substring(0, 10)}] - [${new Date(parseInt(odbornik.key)).toISOString().substring(0, 10)}]</td></tr>
                `;
        }
        // console.log(Object.keys(odbornik.val()))
        // }
    })
})

oDb.ref('SportskaUdruga/povijestUprava/podpredsjednik').on('value', function (odgovor) {
    document.querySelector('#acc4 tbody').innerHTML="";
    odgovor.forEach(function (odbornik) {
        // console.log(odbornik.key);
        // if (odbornik.key != "1") {
        // console.log(odbornik.key)
        // console.log(odbornik.val().pocetakMandata)
        if (Object.keys(odbornik.val())[0] != odbornik.val().pocetakMandata) {
            // console.log(clanovi[Object.keys(odbornik.val())[0]].ime)
            document.querySelector('#acc4 tbody').innerHTML += `
                <tr><td>${clanovi[Object.keys(odbornik.val())[0]].ime} ${clanovi[Object.keys(odbornik.val())[0]].prezime}</td><td>[${new Date(parseInt(odbornik.val().pocetakMandata.pocetakMandata)).toISOString().substring(0, 10)}] - [${new Date(parseInt(odbornik.key)).toISOString().substring(0, 10)}]</td></tr>
                `;
        }
        else if (Object.keys(odbornik.val())[1] != odbornik.val().pocetakMandata) {
            // console.log(clanovi[Object.keys(odbornik.val())[1]].ime)
            document.querySelector('#acc4 tbody').innerHTML += `
                <tr><td>${clanovi[Object.keys(odbornik.val())[1]].ime} ${clanovi[Object.keys(odbornik.val())[1]].prezime}</td><td>[${new Date(odbornik.val().pocetakMandata.pocetakMandata).toISOString().substring(0, 10)}] - [${new Date(odbornik.key).toISOString().substring(0, 10)}]</td></tr>
                `;
        }
        // console.log(Object.keys(odbornik.val()))
        // }
    })
})

oDb.ref('SportskaUdruga/povijestUprava/tajnik').on('value', function (odgovor) {
    document.querySelector('#acc5 tbody').innerHTML="";
    odgovor.forEach(function (odbornik) {
        // console.log(odbornik.key);
        // if (odbornik.key != "1") {
        // console.log(odbornik.key)
        // console.log(odbornik.val().pocetakMandata)
        if (Object.keys(odbornik.val())[0] != odbornik.val().pocetakMandata) {
            // console.log(clanovi[Object.keys(odbornik.val())[0]].ime)
            document.querySelector('#acc5 tbody').innerHTML += `
                <tr><td>${clanovi[Object.keys(odbornik.val())[0]].ime} ${clanovi[Object.keys(odbornik.val())[0]].prezime}</td><td>[${new Date(parseInt(odbornik.val().pocetakMandata.pocetakMandata)).toISOString().substring(0, 10)}] - [${new Date(parseInt(odbornik.key)).toISOString().substring(0, 10)}]</td></tr>
                `;
        }
        else if (Object.keys(odbornik.val())[1] != odbornik.val().pocetakMandata) {
            // console.log(clanovi[Object.keys(odbornik.val())[1]].ime)
            document.querySelector('#acc5 tbody').innerHTML += `
                <tr><td>${clanovi[Object.keys(odbornik.val())[1]].ime} ${clanovi[Object.keys(odbornik.val())[1]].prezime}</td><td>[${new Date(odbornik.val().pocetakMandata.pocetakMandata).toISOString().substring(0, 10)}] - [${new Date(odbornik.key).toISOString().substring(0, 10)}]</td></tr>
                `;
            // }
            // console.log(Object.keys(odbornik.val()))
        }
    })
})

oDb.ref('SportskaUdruga/povijestUprava/likvidator').on('value', function (odgovor) {
    document.querySelector('#acc6 tbody').innerHTML="";
    odgovor.forEach(function (odbornik) {
        // console.log(odbornik.key);
        // if (odbornik.key != "1") {
        // console.log(odbornik.key)
        // console.log(odbornik.val().pocetakMandata)
        if (Object.keys(odbornik.val())[0] != odbornik.val().pocetakMandata) {
            // console.log(clanovi[Object.keys(odbornik.val())[0]].ime)
            document.querySelector('#acc6 tbody').innerHTML += `
                <tr><td>${clanovi[Object.keys(odbornik.val())[0]].ime} ${clanovi[Object.keys(odbornik.val())[0]].prezime}</td><td>[${new Date(parseInt(odbornik.val().pocetakMandata.pocetakMandata)).toISOString().substring(0, 10)}] - [${new Date(parseInt(odbornik.key)).toISOString().substring(0, 10)}]</td></tr>
                `;
        }
        else if (Object.keys(odbornik.val())[1] != odbornik.val().pocetakMandata) {
            // console.log(clanovi[Object.keys(odbornik.val())[1]].ime)
            document.querySelector('#acc6 tbody').innerHTML += `
                <tr><td>${clanovi[Object.keys(odbornik.val())[1]].ime} ${clanovi[Object.keys(odbornik.val())[1]].prezime}</td><td>[${new Date(odbornik.val().pocetakMandata.pocetakMandata).toISOString().substring(0, 10)}] - [${new Date(odbornik.key).toISOString().substring(0, 10)}]</td></tr>
                `;
        }
        // console.log(Object.keys(odbornik.val()))
        // }
    })
})