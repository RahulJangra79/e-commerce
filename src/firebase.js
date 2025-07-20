import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAwx-hxzHf-qd9bBqLju8muDTvFUpMtJP0",
  authDomain: "awe-n-attire.firebaseapp.com",
  projectId: "awe-n-attire",
  storageBucket: "awe-n-attire.firebasestorage.app",
  messagingSenderId: "284729295219",
  appId: "1:284729295219:web:2993a9bfc5c933aec04506",
  measurementId: "G-BZ7GR4SN7T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export {db,  auth, googleProvider, analytics };
