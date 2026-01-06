import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyDfdqoydJKGXilPqkXLMpLaNxNqx3NcT5Y",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "chatapp-184e2.firebaseapp.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    "chatapp-184e2",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "chatapp-184e2.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1269541712",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:1269541712:web:4b66185b5888160bbf9a55",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
