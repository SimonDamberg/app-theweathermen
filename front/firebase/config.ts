import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAQ08Ld0b7Twa9ks1j6DoE_eOVhms85V_g",
    authDomain: "weathermen-801ea.firebaseapp.com",
    projectId: "weathermen-801ea",
    storageBucket: "weathermen-801ea.appspot.com",
    messagingSenderId: "357332381982",
    appId: "1:357332381982:web:bee6d67d81f87b05cad90f",
    measurementId: "G-21ZWQ7QM6B"
};

let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;