import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../utils/firebase-config";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setIsAllowed(false);
        setChecking(false);
        return;
      }

      try {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);

        const isPremium =
          userSnap.exists() && userSnap.data().isPremium === true;
        setIsAllowed(isPremium);
      } catch (err) {
        console.error("Failed to verify premium status:", err);
        setIsAllowed(false);
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Routes that should skip premium check
  const publicRoutes = ["/login", "/signup", "/subscribe", "/subscribed", "/profile", "/change-account"];
  const bypassRoute = publicRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  if (checking) return <LoadingSpinner message="Checking subscription..." />;

  if (!isAllowed && !bypassRoute) {
    return <Navigate to="/subscribe" replace />;
  }

  return children;
}
