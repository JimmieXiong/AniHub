import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import LoadingSpinner from "./LoadingSpinner";

export default function PublicRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setTimeout(() => {
        setIsAuth(!!user);
      }, 2000); 
    });

    return () => unsubscribe();
  }, []);

  if (isAuth === null) return <LoadingSpinner />;

  return isAuth ? <Navigate to="/home" replace /> : children;
}
