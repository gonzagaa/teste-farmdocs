import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAXiJ_Z1DFKSIwv1fZny9Ik5TRDM9H66eQ",
  authDomain: "forfarmdocs.firebaseapp.com",
  projectId: "forfarmdocs",
  storageBucket: "forfarmdocs.appspot.com",
  messagingSenderId: "257447594518",
  appId: "1:257447594518:web:39d135a250817e1e944337"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, auth, storage, db, getApp, getAuth };
