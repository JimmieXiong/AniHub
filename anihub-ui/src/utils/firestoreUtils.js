

import {
  doc,         // reference a specific document
  getDoc,      // to get a specific document
  setDoc,      // to create or overwrite a document
  collection,  // to reference a collection
  getDocs,     // to get all documents in a collection
  deleteDoc,   // to delete a document
} from "firebase/firestore";

import { firestore, firebaseAuth } from "./firebase-config";


// Add an anime to the user's "My List"
export const addToMyList = async (anime) => {
  const user = firebaseAuth.currentUser; // Get currently logged-in user
  if (!user) return; // if no user return null stop performing 

  // Create a reference to the anime document under the user's myList subcollection
  const animeRef = doc(firestore, `users/${user.uid}/myList`, anime.id);

  // Save the anime object to Firestore
  await setDoc(animeRef, anime);
};


// Remove an anime from the user's "My List"
export const removeFromMyList = async (animeId) => {
  const user = firebaseAuth.currentUser; 
  if (!user) return; 

  const animeRef = doc(firestore, `users/${user.uid}/myList`, animeId);

  // Delete the anime document
  await deleteDoc(animeRef);
};


// Check if a specific anime is already in the user's "My List"
export const isInMyList = async (animeId) => {
  const user = firebaseAuth.currentUser; 
  if (!user) return false; 

  // Reference the anime document
  const docRef = doc(firestore, `users/${user.uid}/myList`, animeId);

  // Fetch the document snapshot
  const snap = await getDoc(docRef);

  // Return true if the anime exists in the list, otherwise false
  return snap.exists();
};


// Get all anime in the user's "My List"
export const getMyList = async () => {
  const user = firebaseAuth.currentUser; 
  if (!user) return []; // If no user, return empty list

  // Reference to the user's myList collection
  const snapshot = await getDocs(collection(firestore, `users/${user.uid}/myList`));

  // Map each document to its data and return as an array
  return snapshot.docs.map((doc) => doc.data());
};
