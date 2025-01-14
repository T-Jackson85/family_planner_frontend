import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/api"; // Import the customized Axios instance

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post("/auth/login", formData); // Use the `api` instance
      const { accessToken, refreshToken } = response.data;

      // Save tokens and expiry in localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("tokenExpiry", Date.now() + 15 * 60 * 1000); // 15 minutes expiry

      navigate("/homepage"); // Redirect to homepage
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Log In to FamLink</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Log In</button>
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
