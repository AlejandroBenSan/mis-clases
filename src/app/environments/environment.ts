// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAvXk3sqF61Vj_Yya3-LKWJbE7Qh_vgx7I",
  authDomain: "mis-clases-c13ec.firebaseapp.com",
  projectId: "mis-clases-c13ec",
  storageBucket: "mis-clases-c13ec.appspot.com",
  messagingSenderId: "656444788316",
  appId: "1:656444788316:web:114dedae1c04318dd86099",
  measurementId: "G-0SGZF3F4Z7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);