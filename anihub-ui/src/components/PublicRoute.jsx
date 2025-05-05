import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import LoadingSpinner from "./LoadingSpinner";


/**
 * protects routes that should ONLY be accessible to users who are NOT logged in 
 * If the user is NOT logged in:
 *    - The `children` (e.g. <Login />, <Signup />) will render normally.
 * If the user IS logged in:
 *    - Redirects them to "/home" to prevent access to public-only routes.
 */

export default function PublicRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setIsAuth(!!user); 
    });

    return () => unsubscribe(); 
  }, []);

  if (isAuth === null) return <LoadingSpinner />;

  return isAuth ? <Navigate to="/home" replace /> : children;
}
