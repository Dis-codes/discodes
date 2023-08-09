
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBFXWaWmDS5ZldpFjsEdpb60I5e09Ph3uA",
    authDomain: "discodes-6db31.firebaseapp.com",
    projectId: "discodes-6db31",
    storageBucket: "discodes-6db31.appspot.com",
    messagingSenderId: "787808719564",
    appId: "1:787808719564:web:2923ff159d3390bacd6869",
    measurementId: "G-EZBW41H5NJ"
};


export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
