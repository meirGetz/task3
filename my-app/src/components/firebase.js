// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCrIPOPIUwPutCbf5ZBXDFbSz1B8R-hMmw",
    authDomain: "task3-62426.firebaseapp.com",
    projectId: "task3-62426",
    storageBucket: "task3-62426.appspot.com",
    messagingSenderId: "108465481104",
    appId: "1:108465481104:web:140705286c528722657f15",
    measurementId: "G-W02B5WDT9G"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };