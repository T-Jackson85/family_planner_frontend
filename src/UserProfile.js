import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
} from "@mui/material";
import api from "./api/api"; // Axios instance

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const endpoint = id ? `/api/users/${id}` : "/auth/me";
        const response = await api.get(endpoint);
        const user = response.data;

        setUserData(user);
        setIsCurrentUser(!id);
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setPhone(user.phone || "");
        setLocation(user.location || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const updatedData = {
        firstName,
        lastName,
        phone,
        location,
      };

      await api.put("/update", updatedData);
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  if (!userData) {
    return (
      <Typography variant="h6" align="center">
        Loading user profile...
      </Typography>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", padding: 4, bgcolor: "#f9f9f9" }}>
      <Paper elevation={3} sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isCurrentUser ? "Update Profile" : "User Profile"}
        </Typography>
        <Avatar
          alt={userData.firstName || "User Avatar"}
          src={userData.avatar || ""}
          sx={{ width: 150, height: 150, margin: "auto", marginBottom: 2 }}
        />
        <Typography variant="h4" align="center">
          {userData.firstName} {userData.lastName}
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          {userData.email}
        </Typography>

        {isCurrentUser && (
          <>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Phone"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ marginTop: 3 }}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/homepage")}
              sx={{ marginLeft: 2 }}
            >
              Cancel
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default UserProfile;

