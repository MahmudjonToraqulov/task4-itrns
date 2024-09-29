import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKbQmMqIbcnyd5CFPwr6FH3-3pxuvpuco",
  authDomain: "itransition-task.firebaseapp.com",
  projectId: "itransition-task",
  storageBucket: "itransition-task.appspot.com",
  messagingSenderId: "106736388894",
  appId: "1:106736388894:web:d1324c2014dda687c1170f", 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);



export { app, auth, db };
