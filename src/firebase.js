import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// firebaseでプロジェクトを作成した時のやつを貼り付ける
// 環境変数で取り扱うのがベストそう
const firebaseConfig = {
    apiKey: "dummy",
    authDomain: "dummy",
    projectId: "dummy",
    storageBucket: "dummy",
    messagingSenderId: "dummy",
    appId: "dummy"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const provider = new GoogleAuthProvider(); //追加
export const auth = getAuth(app);
export default app;