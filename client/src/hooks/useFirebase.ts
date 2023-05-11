import { initializeApp } from "firebase/app";

export default function useFirebase() {
  const firebaseConfig = {
    //TODO export into .env file
    apiKey: "AIzaSyCCtVo2gU7eBFsW4RqhMnoC6_qghEaahRI",
    authDomain: "test2-876c9.firebaseapp.com",
    projectId: "test2-876c9",
    storageBucket: "test2-876c9.appspot.com",
    messagingSenderId: "720642594094",
    appId: "1:720642594094:web:c1acb8640d990c64ac56bf"
  };

  const app = initializeApp(firebaseConfig);

  return { app }
}
