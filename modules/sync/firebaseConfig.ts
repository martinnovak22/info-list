import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyANVlWQkbXsLfqdzqGhILNDGYxsnL775TM",
    authDomain: "info-list-a83ad.firebaseapp.com",
    databaseURL: "https://info-list-a83ad-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "info-list-a83ad",
    storageBucket: "info-list-a83ad.firebasestorage.app",
    messagingSenderId: "524667365610",
    appId: "1:524667365610:web:2c7847ed6670591df1cf93"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
