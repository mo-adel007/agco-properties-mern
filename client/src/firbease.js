// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "agco-b062f.firebaseapp.com",
  projectId: "agco-b062f",
  storageBucket: "agco-b062f.appspot.com",
  messagingSenderId: "1063439358416",
  appId: "1:1063439358416:web:4921b2cc81ef7455f501d5",
  measurementId: "G-NBEBNW2036"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
