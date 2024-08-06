// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC87kBsfkLBBpPz4cTWQ0xXvDn1Kz0aNhI",
    authDomain: "task-3-13ba4.firebaseapp.com",
    projectId: "task-3-13ba4",
    storageBucket: "task-3-13ba4.appspot.com",
    messagingSenderId: "581159904389",
    appId: "1:581159904389:web:7620c3335dc9a189e8b5ec",
    measurementId: "G-01R0NRZGWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };