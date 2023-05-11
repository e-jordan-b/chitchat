import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

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
const db = getFirestore(app);


export const createNewCall = async ({userId, callName, callDescription}: {userId: string, callName: string, callDescription: string} ) => {
  try {
    const callRef = doc(collection(db, 'calls'));
    await setDoc(callRef, {
      createdAt: serverTimestamp(),
      participants: [],
      host: userId,
      status: 'active',
      name: callName,
      description: callDescription,
    });
    return callRef.id;
  } catch (error) {
    console.error('Error creating a new call:', error);
    throw error;
  }
};