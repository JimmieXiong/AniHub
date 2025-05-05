import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Navbar from "../components/Navbar";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";

export default function Subscribe() {
  const navigate = useNavigate();
  const [alreadyPremium, setAlreadyPremium] = useState(false);

  useEffect(() => {
    const checkIfPremium = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().isPremium) {
        setAlreadyPremium(true);
      }
    };

    checkIfPremium();
  }, []);

  const handleSubscribe = async (plan) => {
    const user = getAuth().currentUser;
    if (!user) return alert("Please log in first");

    try {
      const res = await axios.post("http://localhost:3002/create-checkout-session", {
        uid: user.uid,
        plan,
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Failed to start checkout.");
    }
  };

  return (
    <Wrapper>
      <Navbar />
      <Container>
        <Content>
          <h1>Unlock AniHub Premium</h1>
          {alreadyPremium && (
            <PremiumNotice>
              🎉 You're already a premium member! You can still change or renew your plan below.
            </PremiumNotice>
          )}
          <p>Stream unlimited Donghua & Anime in HD with no ads. Choose your path below!</p>
          <Plans>
            <PlanCard>
              <h2>Monthly Plan</h2>
              <Price>$18/month</Price>
              <ul>
                <li>Unlimited anime streaming</li>
                <li>High-definition quality</li>
                <li>Early episode access</li>
              </ul>
              <button onClick={() => handleSubscribe("monthly")}>Subscribe Monthly</button>
            </PlanCard>

            <PlanCard>
              <h2>Yearly Plan</h2>
              <Price>$250/year</Price>
              <ul>
                <li>Everything in Monthly</li>
                <li>2 months free bonus</li>
                <li>Priority support</li>
              </ul>
              <button onClick={() => handleSubscribe("yearly")}>Subscribe Yearly</button>
            </PlanCard>
          </Plans>
        </Content>
      </Container>
    </Wrapper>
  );
}


const Wrapper = styled.div`
  background-color: #0d0d0d;
  min-height: 100vh;
`;

const Container = styled.div`
  color: #fff;
  padding: 3rem 1rem;
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  max-width: 1000px;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    color: rgb(150, 59, 236);
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.1rem;
    color: #ccc;
    margin-bottom: 2rem;
  }
`;

const Plans = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
`;

const PlanCard = styled.div`
  background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
  padding: 2rem;
  border-radius: 12px;
  width: 300px;
  box-shadow: 0 0 20px rgba(255, 64, 129, 0.2);
  text-align: left;

  h2 {
    color: #ffffff;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin: 1rem 0;

    li {
      margin: 0.5rem 0;
      color: #ddd;
    }
  }

  button {
    margin-top: 1rem;
    width: 100%;
    padding: 0.8rem;
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
      transform: scale(1.05);
    }
  }
`;

const Price = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffe600;
  margin-bottom: 0.75rem;
`;
const PremiumNotice = styled.div`
  background-color: #292929;
  color: #ffe600;
  border-left: 5px solid #ffde59;
  padding: 1rem;
  margin-bottom: 1rem;
  font-weight: 500;
  font-size: 1rem;
  border-radius: 6px;
`;
