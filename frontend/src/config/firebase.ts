// src/config/firebase.ts
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBAAFCDM8HgSpIfcdZGWX4nKsHEnrAXU-U",
  authDomain: "tetris-game-oauth.firebaseapp.com",
  projectId: "tetris-game-oauth",
  storageBucket: "tetris-game-oauth.firebasestorage.app",
  messagingSenderId: "679946153536",
  appId: "1:679946153536:web:0fdfb33fde4236942e39a5",
  measurementId: "G-7KNPJH952G"
};


export const app = initializeApp(firebaseConfig);