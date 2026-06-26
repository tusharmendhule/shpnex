import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDTSaBWD6TUWa3ywmgQQxi_3rE57UU5c3U",
  authDomain: "shpnex-b6104.firebaseapp.com",
  projectId: "shpnex-b6104",
  storageBucket: "shpnex-b6104.firebasestorage.app",
  messagingSenderId: "1044250320724",
  appId: "1:1044250320724:web:557287183017484f9632c1",
  measurementId: "G-2M0HXDBRP8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);