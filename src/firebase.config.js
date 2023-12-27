// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBFNgAAVeTzQNKY0xAbFQlqBkv43bP0u7c",
    authDomain: "house-marketplace-82c1d.firebaseapp.com",
    projectId: "house-marketplace-82c1d",
    storageBucket: "house-marketplace-82c1d.appspot.com",
    messagingSenderId: "680611696362",
    appId: "1:680611696362:web:a404feb00a213afd685193",
    measurementId: "G-3LG1DHLC6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore();