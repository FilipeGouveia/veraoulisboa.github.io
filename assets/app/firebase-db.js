const firebaseConfig = {
  // ATENÇÃO: Tem de substituir estes valores pelos do seu projeto Firebase!
  // Vá à consola do Firebase -> Configurações do Projeto -> Adicionar app Web
  apiKey: "COLOQUE_AQUI_A_SUA_API_KEY",
  authDomain: "seu-projeto-firebase.firebaseapp.com",
  projectId: "seu-projeto-firebase",
  storageBucket: "seu-projeto-firebase.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123"
};

// Inicializar o Firebase caso ainda não esteja
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Referência para a base de dados Firestore
const db = firebase.firestore();
