// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCUBJs7g1F7Ms6eDMh1zQDz55Mf_kzWu-M",
    authDomain: "estadiautsjr.firebaseapp.com",
    projectId: "estadiautsjr",
    storageBucket: "estadiautsjr.appspot.com",
    messagingSenderId: "925327299009",
    appId: "1:925327299009:web:f081a31c0bc48b01d01f40"
 };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };