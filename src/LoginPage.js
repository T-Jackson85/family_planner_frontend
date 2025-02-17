import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/api"; // Import the customized Axios instance

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { accessToken, refreshToken, user } = response.data;

      // Save tokens and user details in localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user)); // Store user details, including groups

      // Log groupIds to verify they are stored
      console.log(user.groupIds); // Array of group IDs

      navigate("/homepage"); // Redirect to the homepage
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    await handleLogin(); // Call the login function
  };

  return (
    <div style={styles.container}>
      <h1>Log In to FamLink</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          Log In
        </button>
      </form>
      <p style={styles.toggleText}>
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          style={styles.toggleButton}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    margin: "10px 0",
    textAlign: "left",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px",
    marginTop: "10px",
    cursor: "pointer",
  },
  toggleText: {
    marginTop: "10px",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    textDecoration: "underline",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};

export default LoginPage;
