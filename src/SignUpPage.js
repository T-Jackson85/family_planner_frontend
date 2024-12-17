import React from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/users/new");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to FamLink</h1>
      <p>Click below to complete your profile setup.</p>
      <button
        onClick={handleRedirect}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go to Profile Setup
      </button>
    </div>
  );
};

export default SignUpPage;
