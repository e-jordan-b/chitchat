import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCtVo2gU7eBFsW4RqhMnoC6_qghEaahRI",
  authDomain: "test2-876c9.firebaseapp.com",
  projectId: "test2-876c9",
  storageBucket: "test2-876c9.appspot.com",
  messagingSenderId: "720642594094",
  appId: "1:720642594094:web:c1acb8640d990c64ac56bf"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);