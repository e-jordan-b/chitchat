import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const firebaseConfig = {
  apiKey: 'AIzaSyAlzuBUnUOeFo4EyoaIotplfexPFknM2DM',
  databaseURL: 'https://video-call-1c0aa-default-rtdb.europe-west1.firebasedatabase.app/'
};

firebase.initializeApp(firebaseConfig);

let dbRef = firebase.database().ref();
export let connectedRef = firebase.database().ref('.info/connected');
//change when authentification
export const userName = prompt("Enter your name:")

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('id')
//change later for custom rooms
if(roomId) {
  dbRef = dbRef.child(roomId);
}else {
  dbRef = dbRef.push();
  window.history.replaceState(null, "Call", "?id=" + dbRef.key)
}

export default dbRef;