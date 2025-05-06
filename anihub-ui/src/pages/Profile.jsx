import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../utils/firebase-config";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Profile() {
  // to store authenticated user info
  const [user, setUser] = useState(null);
  // check if user is a premium subscriber
  const [isPremium, setIsPremium] = useState(false);
  //  for subscription start and end dates
  const [subscribedAt, setSubscribedAt] = useState(null);
  const [subscriptionEnds, setSubscriptionEnds] = useState(null);

  // listen to auth state changes and fetch user data
  useEffect(() => {
    // Firebase auth listener
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Get user document from Firestore
        const docRef = doc(firestore, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        // If document exists, set premium and subscription date states
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.isPremium) setIsPremium(true);
          if (data.subscribedAt?.toDate) {
            setSubscribedAt(data.subscribedAt.toDate());
          }
          if (data.subscriptionEndsAt?.toDate) {
            setSubscriptionEnds(data.subscriptionEndsAt.toDate());
          }
        }
      }
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <Wrapper>
      <Navbar />
      <Container>
        <h1>My Profile</h1>

        {user ? (
          <ProfileBox>
            <p><strong>Username:</strong> {user.displayName || "N/A"}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Subscription:</strong> {isPremium ? "Premium" : "Free"}</p>
            <p><strong>Joined:</strong> {new Date(user.metadata?.creationTime).toLocaleDateString()}</p>

            {/* Show subscription dates if premium */}
            {isPremium && (
              <>
                <p><strong>Subscribed At:</strong> {subscribedAt ? subscribedAt.toLocaleDateString() : "N/A"}</p>
                <p><strong>Subscription Ends:</strong> {subscriptionEnds ? subscriptionEnds.toLocaleDateString() : "N/A"}</p>
              </>
            )}

            {/* Link to change account settings */}
            <Link to="/change-account">
              <SettingsButton>Change Account Settings</SettingsButton>
            </Link>
          </ProfileBox>
        ) : (
          // Fallback loading message
          <p style={{ textAlign: "center" }}>Loading user info...</p>
        )}
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: #0d0d0d;
  min-height: 100vh;
`;

const Container = styled.div`
  padding: 4rem 2rem;
  color: white;
  position: relative;
  z-index: 2;

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const ProfileBox = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.8;
  text-align: left;

  p {
    margin: 0.5rem 0;
    font-size: 1rem;
  }
`;

const SettingsButton = styled.button`
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.75rem;
  background: rgb(150, 59, 236);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: #ff1c65;
    transform: scale(1.03);
  }
`;
