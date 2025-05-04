import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      // Add slight delay to show spinner (purely for polish)
      setTimeout(() => {
        setIsAuth(!!user);
      }, 2000); // 2sec spinner effect
    });

    return () => unsubscribe();
  }, []);

  if (isAuth === null) return <LoadingSpinner />;

  return isAuth ? children : <Navigate to="/login" replace />;
}
