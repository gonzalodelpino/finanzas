import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCA4hG839TX9b2RUoRzS89Z42RVXLfRGTU",
  authDomain: "finanzas-2a649.firebaseapp.com",
  projectId: "finanzas-2a649",
  storageBucket: "finanzas-2a649.appspot.com",
  messagingSenderId: "998963751898",
  appId: "1:998963751898:web:ef36c14fbff3aa26d62ee3",
  measurementId: "G-HC6JYCDQ44"
};

// Inicializamos la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Obtenemos las instancias necesarias de Firebase
const auth = getAuth(app);
const db = getFirestore(app);  // Referencia a Firestore

// Configuración de Analytics (opcional)
let analytics: ReturnType<typeof getAnalytics> | null = null;

isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Analytics habilitado");
    } else {
      console.log("Analytics no es soportado en este navegador");
    }
  })
  .catch((error) => {
    console.error("Error al inicializar Analytics:", error);
  });

// Exportamos las configuraciones para su uso en otros archivos
export { auth, db, analytics };
