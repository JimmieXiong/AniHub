import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    deleteDoc,
  } from "firebase/firestore";
  import { firestore, firebaseAuth } from "./firebase-config";

  
  export const addToMyList = async (anime) => {
    const user = firebaseAuth.currentUser;
    if (!user) return;
  
    const animeRef = doc(firestore, `users/${user.uid}/myList`, anime.id);
    await setDoc(animeRef, anime);
  };
  
  export const removeFromMyList = async (animeId) => {
    const user = firebaseAuth.currentUser;
    if (!user) return;
  
    const animeRef = doc(firestore, `users/${user.uid}/myList`, animeId);
    await deleteDoc(animeRef);
  };
  
  export const isInMyList = async (animeId) => {
    const user = firebaseAuth.currentUser;
    if (!user) return false;
  
    const docRef = doc(firestore, `users/${user.uid}/myList`, animeId);
    const snap = await getDoc(docRef);
    return snap.exists();
  };
  
  export const getMyList = async () => {
    const user = firebaseAuth.currentUser;
    if (!user) return [];
  
    const snapshot = await getDocs(collection(firestore, `users/${user.uid}/myList`));
    return snapshot.docs.map((doc) => doc.data());
  };
  