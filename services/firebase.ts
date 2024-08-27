import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB29Vr_Gr5WOlrT2xePFjaAYhSDIHSzfZs",
  authDomain: "medconsulta-2b6df.firebaseapp.com",
  projectId: "medconsulta-2b6df",
  storageBucket: "medconsulta-2b6df.appspot.com",
  messagingSenderId: "394701899441",
  appId: "1:394701899441:web:23928a6e6f7885f7688490",
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
