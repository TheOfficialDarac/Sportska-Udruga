(function () {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // console.log('korisnik se ulogirao.')
        }
        else {
            var newURL = window.location.origin + "/login.html"
            window.location.replace(newURL);
        }
    });
})();