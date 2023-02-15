//  login korisnika, zove gumbic pritiskom na login
//  podaci za testing: mail, password
//                     testing@vuv.hr, testing123
function Login()
{
  var emailOne = document.getElementById('email').value;
  var passwordOne = document.getElementById('password').value;
  
  auth.signInWithEmailAndPassword(emailOne, passwordOne)
  .then((user) => {
    window.open('../index.html', '_self');
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

//  registracija korisnika u aplikaciju pritiskom na gumbic za registraciju novog korisnika
function SignUp(){
  let email = document.querySelector("#signUpEmail").value;
  let pass = document.querySelector("#signUpPassword").value;
  auth.createUserWithEmailAndPassword(email, pass).then(() => {
    $("#SignUpModal").modal('hide');
  })
}

//  fju zove gumbic u navbaru za logout korisnika
function LogOut(){
  auth.signOut();
}

//  funkcija koja otvara modal za registraciju korisnika
function OpenSignUpModal(){
  $('#signUpEmail').val('');
  $('#signUpPassword').val('');
  $('#SignUpModal').modal('show');
}
const loginForm = document.querySelector('#login-form');
loginForm.reset();
const baseLogin = document.querySelector('#baseLoginForm');
baseLogin.reset();