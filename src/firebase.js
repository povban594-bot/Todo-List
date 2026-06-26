// src/firebase.js

// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZcn9xwzEjvS85jfhgs-4sZGLvtc73XMg",
  authDomain: "my-todo-project-a8fda.firebaseapp.com",
  projectId: "my-todo-project-a8fda",
  storageBucket: "my-todo-project-a8fda.firebasestorage.app",
  messagingSenderId: "273165363449",
  appId: "1:273165363449:web:c1e1352a4ee4e929cf9a28",
  measurementId: "G-4WG5LLK9MC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
