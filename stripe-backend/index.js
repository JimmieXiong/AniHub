require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// Validate Firebase config
if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  console.error("Missing Firebase config in .env");
  process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();
const PORT = 3002;

// ---------------------------------------------
// Create Stripe Checkout Session
// ---------------------------------------------
app.post("/create-checkout-session", async (req, res) => {
  const { uid, plan } = req.body;

  const prices = {
    monthly: 1800,   // $18.00
    yearly: 25000,   // $250.00
  };

  if (!prices[plan]) {
    return res.status(400).json({ error: "Invalid subscription plan" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `AniHub ${plan} subscription`,
            },
            unit_amount: prices[plan],
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/subscribed?uid=${uid}&plan=${plan}`,
      cancel_url: "http://localhost:3000/subscribe",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(" Stripe session error:", err.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// ---------------------------------------------
//  Mark User as Premium
// ---------------------------------------------
// Mark user as premium
app.post("/mark-premium", async (req, res) => {
    const { uid, plan } = req.body;
    const idToken = req.headers.authorization?.split("Bearer ")[1];
  
    if (!idToken) return res.status(401).send("Unauthorized: No token");
  
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (decoded.uid !== uid) return res.status(403).send("UID mismatch");
  
      const now = admin.firestore.Timestamp.now();
      let expiresAt;
  
      if (plan === "monthly") {
        expiresAt = admin.firestore.Timestamp.fromDate(
          new Date(now.toDate().getTime() + 30 * 24 * 60 * 60 * 1000)
        );
      } else if (plan === "yearly") {
        expiresAt = admin.firestore.Timestamp.fromDate(
          new Date(now.toDate().getTime() + 365 * 24 * 60 * 60 * 1000)
        );
      } else {
        return res.status(400).send("Invalid plan");
      }
  
      await db.collection("users").doc(uid).set(
        {
          isPremium: true,
          subscriptionPlan: plan,
          subscribedAt: now,
          subscriptionEndsAt: expiresAt, // ✅ this needs to exist!
        },
        { merge: true }
      );
  
      res.status(200).send("User marked as premium");
    } catch (err) {
      console.error("mark-premium error:", err.message);
      res.status(401).send("Unauthorized");
    }
  });
  

app.listen(PORT, () => {
  console.log(` Stripe backend running at http://localhost:${PORT}`);
});
