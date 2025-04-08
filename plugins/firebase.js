import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export default defineNuxtPlugin(() => {
    const firebaseConfig = {
        apiKey: "AIzaSyCsyHh716Pz1G-cVLboK3M4Ayczg77PWrw",
        authDomain: "nuvella-c5697.firebaseapp.com",
        projectId: "nuvella-c5697",
        storageBucket: "nuvella-c5697.firebasestorage.app",
        messagingSenderId: "378108214920",
        appId: "1:378108214920:web:3b886dbff1e00b8f36693d",
        measurementId: "G-9LJER2PH18",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    return {
        provide: {
            auth,
            provider,
        },
    };
});
