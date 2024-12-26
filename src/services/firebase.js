// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDCOpncXd9hLC1bqQSIjA1s-hdpwuu5iz4",
    authDomain: "uni-cap-pro.firebaseapp.com",
    projectId: "uni-cap-pro",
    storageBucket: "uni-cap-pro.firebasestorage.app",
    messagingSenderId: "23506474998",
    appId: "1:23506474998:web:cd7150ac50f611d5fe19d7",
    measurementId: "G-B1LQFWTDFG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);