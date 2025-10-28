import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore, collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7AK6I_KmkFEZIaWJokO5HN1UnejpHZ3U",
  authDomain: "the-bus-94fe3.firebaseapp.com",
  projectId: "the-bus-94fe3",
  storageBucket: "the-bus-94fe3.firebasestorage.app",
  appId: "1:782387450057:web:d6d4dcf0fd778ff6533d18",
  measurementId: "G-D9627JEYQ6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 永続的ログイン設定
await setPersistence(auth, browserLocalPersistence);

const form = document.getElementById("login-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const selectedType = document.getElementById("userType").value;

  try {
    // Firebase Authで認証
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestoreのaccountsコレクションで照合
    const q = query(collection(db, "accounts"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error("アカウント情報が見つかりません");
    }

    const userData = snapshot.docs[0].data();

    if (userData.password !== password) {
      throw new Error("パスワードが一致しません");
    }

    if (userData.userType !== selectedType) {
      throw new Error("ユーザー種別が一致しません");
    }

    // 種別に応じたリダイレクト
    switch (userData.userType) {
      case "driver":
        window.location.href = "index-driver.html";
        break;
      case "general":
        window.location.href = "index-general.html";
        break;
      case "admin":
        window.location.href = "index-admin.html";
        break;
      default:
        throw new Error("不明なユーザー種別です");
    }

  } catch (err) {
    console.error(err);
    message.textContent = "ログインに失敗しました：" + err.message;
  }
});
