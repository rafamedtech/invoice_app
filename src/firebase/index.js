import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDYCb4UFteFgkMhbAqJcGgKD2H7Bn-Ma_w",
  authDomain: "invoice-app-6ec98.firebaseapp.com",
  projectId: "invoice-app-6ec98",
  storageBucket: "gs://invoice-app-6ec98.appspot.com",
  // storageBucket: "invoice-app-6ec98.appspot.com",
  messagingSenderId: "710282801726",
  appId: "1:710282801726:web:e37f728d791ad0039ad76f",
};

firebase.initializeApp(firebaseConfig);
const storageRef = firebase.storage().ref();
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth, storageRef };
