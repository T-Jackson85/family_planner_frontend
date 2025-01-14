import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Alert } from "@mui/material";
import dayjs from "dayjs";
import api from "./api/api";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthday: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const { firstName, lastName, email, password, confirmPassword, phone, birthday, location } =
      formData;

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const response = await api.post("http://localhost:5000/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        phone,
        birthday: birthday ? dayjs(birthday).toISOString() : null,
        location,
      });

      const { user } = response.data;
      setSuccess(true);

      // Redirect to Homepage with user data
      setTimeout(() => navigate(`/profile/${user.id}`, { state: { user } }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f9f9f9",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create an Account
        </Typography>
        {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ marginBottom: 2 }}>Registration successful! Redirecting...</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            margin="normal"
          />
          <Button fullWidth variant="contained" color="primary" type="submit" sx={{ marginTop: 2 }}>
            Sign Up
          </Button>
        </form>
        <Typography align="center" sx={{ marginTop: 2 }}>
          Already have an account?{" "}
          <Button color="primary" onClick={() => navigate("/users/login")}>
            Login
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUpPage;
