const firebaseConfig = {
  apiKey: "AIzaSyD7JF7mPt1XnIlEskPjkJ6PwRVpqECvKss",
  authDomain: "aprenderaprogramar-fcul.firebaseapp.com",
  projectId: "aprenderaprogramar-fcul",
  storageBucket: "aprenderaprogramar-fcul.firebasestorage.app",
  messagingSenderId: "452942904088",
  appId: "1:452942904088:web:a446e5addff9f745d63c6d",
  measurementId: "G-RYLEC24G7F"
};

// Inicializar o Firebase usando o formato compat
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Referência para a base de dados Firestore
const db = firebase.firestore();
