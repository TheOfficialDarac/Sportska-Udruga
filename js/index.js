let vijesti = {};
oDb.ref('SportskaUdruga/vijesti').on('value', function (odgovor){
    document.querySelector('#mainAside tbody').innerHTML=``;
    vijesti = {};

    odgovor.forEach(vijest => {
        vijesti[vijest.key]= vijest.val();
        document.querySelector('#mainAside tbody').innerHTML+=`
        <tr><td><a onclick="ReadNews('${vijest.key}')">${vijest.val().title}</a></td></tr>`;
    });
})
function AddNewsModal(){
    document.querySelector('#addNewsForm').reset();
    $('#addNewsModal').modal('show')
}

function SaveNews(date){
    let title = document.querySelector('#inputTitle').value;
    let text = document.querySelector('#newsText').value;

    if (date == "") { date = new Date().getTime(); }
    else {
        title = document.querySelector('#inputEditTitle').value;
        text = document.querySelector('#newsEditText').value;
    }
    let zapis={};
    zapis[date] = {
        'title':title,
        'text':text
    }
    oDb.ref('SportskaUdruga/vijesti').update(zapis)
    $('#addNewsModal').modal('hide');
    $('#readNewsModal').modal('hide')
    $('#editNewsModal').modal('hide');

}
function ReadNews(vijest){
    document.querySelector('#readNewsModalLabel').textContent = `"${vijesti[vijest].title}"`;
    document.querySelector('#textNEWS').textContent = vijesti[vijest].text
    document.querySelector('#editBTN').setAttribute('onclick', `EditNews('${vijest}')`)
    $('#readNewsModal').modal('show')
}
function EditNews(vijest){
    document.querySelector("#editNewsForm").reset();
    document.querySelector('#inputEditTitle').value = vijesti[vijest].title;
    document.querySelector('#newsEditText').value  = vijesti[vijest].text;
    document.querySelector("#saveEditBTN").setAttribute('onclick', `SaveNews('${vijest}')`)
    $('#editNewsModal').modal('show');
}