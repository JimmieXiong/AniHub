import React, { useState } from "react";
import {
  updatePassword,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import Navbar from "../components/Navbar";

export default function ChangeAccount() {
  const user = firebaseAuth.currentUser;

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const reauthenticateUser = async (user, password) => {
    const credential = EmailAuthProvider.credential(user.email, password);
    return reauthenticateWithCredential(user, credential);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      if (newUsername) {
        await updateProfile(user, { displayName: newUsername });
        console.log("Username updated:", newUsername);
      }

      if (newPassword) {
        if (!currentPassword) {
          throw new Error("Please enter your current password to change your password.");
        }
        await reauthenticateUser(user, currentPassword);
        await updatePassword(user, newPassword);
        console.log("Password updated successfully.");
      }

      setMessage("Account updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update account.");
    }
  };

  return (
    <div style={{ backgroundColor: "#0d0d0d", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Update Account</h1>
        <form onSubmit={handleUpdate} style={styles.form}>
          <input
            type="text"
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Save Changes
          </button>
        </form>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "3rem 2rem",
    color: "white",
    zIndex: 2,
    position: "relative",
    maxWidth: "500px",
    margin: "auto",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "1rem",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  success: {
    color: "#00ff99",
    marginTop: "1rem",
    textAlign: "center",
  },
  error: {
    color: "#ff5555",
    marginTop: "1rem",
    textAlign: "center",
  },
};
