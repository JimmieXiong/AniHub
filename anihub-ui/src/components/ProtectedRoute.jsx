import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../utils/firebase-config";
import LoadingSpinner from "./LoadingSpinner";

// Component to protect premium routes
export default function ProtectedRoute({ children }) {
  // State to track if we're still checking user auth and premium status
  const [checking, setChecking] = useState(true);
  // State to determine if the user is allowed to access the route
  const [isAllowed, setIsAllowed] = useState(false);
  // Current page location (used for checking public routes)
  const location = useLocation();

  useEffect(() => {
    // Listen for auth state changes (user logs in or out)
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        // If no user is logged in, deny access
        setIsAllowed(false);
        setChecking(false);
        return;
      }

      try {
        // Get a reference to the user document in Firestore
        const userRef = doc(firestore, "users", user.uid);
        // Fetch the user document
        const userSnap = await getDoc(userRef);

        // Check if the user is marked as premium
        const isPremium =
          userSnap.exists() && userSnap.data().isPremium === true;
        // Set permission based on premium status
        setIsAllowed(isPremium);
      } catch (err) {
        console.error("Failed to verify premium status:", err);
        setIsAllowed(false);
      }

      // Done checking
      setChecking(false);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  // routes that don't require premium access
  const publicRoutes = [
    "/login",
    "/signup",
    "/subscribe",
    "/subscribed",
    "/profile",
    "/change-account",
  ];

  // Check if the current path matches a public route
  const bypassRoute = publicRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // While we're checking user status, show a loading spinner
  if (checking) return <LoadingSpinner message="Loading..." />;

  // If user is not premium and this is not a public route, redirect to subscribe
  if (!isAllowed && !bypassRoute) {
    return <Navigate to="/subscribe" replace />;
  }

  // If everything is okay, render the protected children components
  return children;
}
