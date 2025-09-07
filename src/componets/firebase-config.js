// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'; // como pusiste databaseURL, usarás Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyAmB27NPX3iMshKQ2TCzZ8fqi7s_hoGNZM",
  authDomain: "focas-pagina.firebaseapp.com",
  databaseURL: "https://focas-pagina-default-rtdb.firebaseio.com",
  projectId: "focas-pagina",
  storageBucket: "focas-pagina.firebasestorage.app",
  messagingSenderId: "85778998922",
  appId: "1:85778998922:web:96488b3b06b871fcb1ef73",
  measurementId: "G-2ME9E178TK"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la base de datos para usarla en otros archivos
export const db = getDatabase(app);
