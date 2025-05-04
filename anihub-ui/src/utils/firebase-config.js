import { initializeApp } from "firebase/app";
import { getAuth}  from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAKxGdQMGqm75kXX0OrrneAOsTeVpXi0AA",
  authDomain: "anihub-e954f.firebaseapp.com",
  projectId: "anihub-e954f",
  storageBucket: "anihub-e954f.firebasestorage.app",
  messagingSenderId: "81380553354",
  appId: "1:81380553354:web:64c9c8890a082cb9fe3373",
  measurementId: "G-5XPB0W6EPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);