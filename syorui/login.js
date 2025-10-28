import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore, collection, addDoc, query, where, getDocs
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

await setPersistence(auth, browserLocalPersistence);

const message = document.getElementById("message");

// ========================
// 🔹 ログイン処理
// ========================
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const selectedType = document.getElementById("userType").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestoreでユーザー種別を照合
    const q = query(collection(db, "accounts"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) throw new Error("ユーザー情報が見つかりません");
    const userData = snapshot.docs[0].data();

    if (userData.userType !== selectedType) {
      throw new Error("ユーザー種別が一致しません");
    }

    // 成功時リダイレクト
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
    message.textContent = "ログインに失敗しました：" + err.message;
  }
});

// ========================
// 🔹 新規登録処理
// ========================
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";

  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const userType = document.getElementById("signup-userType").value;

  try {
    // Firebase Authでアカウント作成
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const now = new Date().toISOString();

    // Firestoreにも登録情報を保存
    await addDoc(collection(db, "accounts"), {
      createdAt: now,
      updatedAt: now,
      userId: user.uid,
      email: email,
      password: password, // 実運用ではハッシュ化必須
      userType: userType
    });

    message.style.color = "green";
    message.textContent = "登録が完了しました！ログインしてください。";
    document.getElementById("signup-form").reset();

  } catch (err) {
    console.error(err);
    message.style.color = "red";
    message.textContent = "登録に失敗しました：" + err.message;
  }
});
