// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKAiV6pGJrdbGpXQ1OjLSpirONtGGo-Ac",
  authDomain: "skainvoice-fcd33.firebaseapp.com",
  projectId: "skainvoice-fcd33",
  storageBucket: "skainvoice-fcd33.appspot.com",
  messagingSenderId: "51041782838",
  appId: "1:51041782838:web:1f8b65a49e49787d191c97",
  measurementId: "G-LX34128FPL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
