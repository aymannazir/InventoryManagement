// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqEnMy0-IXkdc_La7uP_3MLuZsOHzVJfA",
  authDomain: "inventory-management-ac226.firebaseapp.com",
  projectId: "inventory-management-ac226",
  storageBucket: "inventory-management-ac226.appspot.com",
  messagingSenderId: "1087872974197",
  appId: "1:1087872974197:web:db154f6d3283c0d065273c",
  measurementId: "G-944R4FB5XW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore }
