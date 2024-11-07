// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return { user, signIn, signOut };
};