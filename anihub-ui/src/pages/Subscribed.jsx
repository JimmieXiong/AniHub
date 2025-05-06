import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Navbar from "../components/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default function Subscribed() {
  const navigate = useNavigate(); 
  const [searchParams] = useSearchParams(); // To extract URL query parameters
  const plan = searchParams.get("plan") || "monthly"; // Get plan type (monthly/yearly)
  const [loading, setLoading] = useState(true); 

  //  runs once on mount to update user status in backend
  useEffect(() => {
    const auth = getAuth();

    // Watch for user login status
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn("User not logged in after Stripe redirect");
        setLoading(false);
        return;
      }

      try {
        // Get a secure token to prove identity
        const token = await user.getIdToken();

        // POST request to backend to mark the user as premium in Firestore
        const res = await axios.post(
          "http://localhost:3002/mark-premium",
          { uid: user.uid, plan }, // Include plan type and user ID
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass Firebase token in header
            },
          }
        );
        console.log("Premium status saved:", res.status);
      } catch (err) {
        console.error("Failed to mark user as premium:", err.response?.data || err.message);
      }

      // After marking is done (or failed), stop loading state
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [plan]);

  // While account is being marked as premium, show loading UI
  if (loading) {
    return (
      <>
        <Navbar />
        <Container>
          <p style={{ color: "#fff", fontSize: "1.2rem" }}>
            Marking your account as Premium...
          </p>
        </Container>
      </>
    );
  }

  // Once done, show success confirmation UI
  return (
    <>
      <Navbar />
      <Container>
        <Card>
          <h1>Welcome to AniHub Premium!</h1>
          <p>
            You now have full access to exclusive episodes, high-quality
            streams, and all premium perks.
          </p>
          <Button onClick={() => navigate("/home")}>Go to Home</Button>
        </Card>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background-color: #0d0d0d;
  padding: 2rem;
`;

// shows the welcome message
const Card = styled.div`
  background: linear-gradient(135deg, #1f1f1f, #2d2d2d);
  color: #ffffff;
  padding: 3rem 4rem;
  border-radius: 1rem;
  box-shadow: 0 0 25px rgb(150, 59, 236);
  text-align: center;
  max-width: 600px;

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: rgb(150, 59, 236);
  }

  p {
    margin: 0.75rem 0;
    line-height: 1.6;
  }
`;

//  button with hover and transition effect
const Button = styled.button`
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  color: white;
  background: rgb(150, 59, 236);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: rgb(150, 59, 236);
    transform: scale(1.05);
  }
`;
