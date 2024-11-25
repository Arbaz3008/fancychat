import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDnSls-edMXTz8HN0UTa4CxYbmADpY82b8",
  authDomain: "fancychat-2ff69.firebaseapp.com",
  projectId: "fancychat-2ff69",
  storageBucket: "fancychat-2ff69.firebasestorage.app",
  messagingSenderId: "931806365654",
  appId: "1:931806365654:web:96776b5dc5f6d88a110677",
  measurementId: "G-88YTX5X7LJ"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
 export const auth = getAuth(app);
 export const firestore = db;//
 