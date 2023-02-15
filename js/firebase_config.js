// Inicijalizacija Firebase-a

const firebaseConfig = {
  apiKey: "AIzaSyCtDpMyjEg5ED2SGR6wNLYjp2qMlyxlvec",
  authDomain: "sportskaudruga-c4c44.firebaseapp.com",
  databaseURL: "https://sportskaudruga-c4c44-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sportskaudruga-c4c44",
  storageBucket: "sportskaudruga-c4c44.appspot.com",
  messagingSenderId: "241759518327",
  appId: "1:241759518327:web:3f7cfe3c2a7406a8235072"
};

firebase.initializeApp(firebaseConfig);

var oDb = firebase.database();
var auth = firebase.auth();

var UdrugaRef = oDb.ref('SportskaUdruga');
var sportoviRef = oDb.ref('SportskaUdruga/sportovi');
var clanoviRef = oDb.ref('SportskaUdruga/clanovi');

var predsjednikRef = oDb.ref('SportskaUdruga/uprava/predsjednik');
var nadzorniOdborRef = oDb.ref('SportskaUdruga/uprava/nadzorniOdbor');
var izvrsniOdborRef = oDb.ref('SportskaUdruga/uprava/izvrsniOdbor');
var vicePresidentRef = oDb.ref('SportskaUdruga/uprava/podpredsjednik');
var tajnikRef = oDb.ref("SportskaUdruga/uprava/tajnik");
var likvidatorRef = oDb.ref('SportskaUdruga/uprava/likvidator')