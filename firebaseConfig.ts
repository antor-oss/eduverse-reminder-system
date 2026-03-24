// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDTgA19sz07lb2vfpgQ_1wwgecNc67xKq4",
    authDomain: "eduverse-reminder-system.firebaseapp.com",
    projectId: "eduverse-reminder-system",
    storageBucket: "eduverse-reminder-system.firebasestorage.app",
    messagingSenderId: "290203926388",
    appId: "1:290203926388:web:13dc0576ce3af3bb857621",
    measurementId: "G-SSC2QVZE8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize analytics only on client-side
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    }).catch((err) => {
        console.log('Analytics not supported:', err);
    });
}

export default app;