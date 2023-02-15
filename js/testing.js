const opcije = document.getElementById("sportovi");
for (let index = 1; index < 5; index++) {
    opcije.innerHTML +=`
    <div class="form-container"><label for="check-${index}">OPT:</label>
    <input class="ch-box" type="checkbox" name="check-${index}" value="check-${index}" id="check-${index}">OPtion</input></div>`;
};
opcije.innerHTML+= `<button type="button" onclick="Fja()">KLIKNI ME</button>`
function Fja() {
    var myNodeList = document.querySelectorAll(".ch-box");
    for (let index = 0; index < myNodeList.length; index++) {
        if (myNodeList[index].checked === true)
        console.log(myNodeList[index].name)
    }
};

//  provjera ako je unesena vrijednost tipa string ili je neprihvatljive duzine
function checkingOIB()
{
    let oib = document.getElementById('checkOIB').value;
    //console.log(typeof oib)
    if (isNaN(oib)){
        console.log('is string.')
        return;
    }
    else if(oib.length != 11){
        console.log('wrong length.')
        return;
    }
    else{
        console.log('all is well')
    }
    console.log('this worked.')
}

console.log(parseInt(new Date().toISOString().substring(5,7)))
// // console.log(new Date().getFullYear().toString() + " "+ (new Date().getMonth() + 1).toString())
// console.log()

// let nekiNaziv = sobe[oKatSnapshot.Key]
// nekiNaziv[tipsobe][nesto]
console.log("NOW: "+ new Date(1769971880770).toISOString())