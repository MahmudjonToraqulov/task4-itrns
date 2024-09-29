// src/auth.js
import { auth } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export const register = async (name, email, password, ) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Store user info in Firestore
  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    registrationTime: new Date(),
    lastLoginTime: new Date(),
    status: 'active', // or 'blocked'
  });
};

export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Fetch user status from Firestore
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    // User document does not exist
    await signOut(auth); // Log out the user
    throw new Error('User account does not exist. Please register.');
  }

  const userData = userDoc.data();
  if (userData.status === 'blocked' || userData.status === 'deleted') {
    // Log out the user if they are blocked or deleted
    await signOut(auth);
    throw new Error('User is blocked or deleted. Please contact support.');
  }

  // Update last login time
  await setDoc(doc(db, "users", user.uid), {
    lastLoginTime: new Date(),
  }, { merge: true });
};






export const logout = async () => {
  await signOut(auth);
};
