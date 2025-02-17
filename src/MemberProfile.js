import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Paper,
  AppBar,
  Toolbar,
  Button,
  TextField,
} from "@mui/material";
import api from "./api/api";

const MemberProfile = () => {
  const { userId } = useParams(); // Extract user ID from the URL params
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/users/login"; // Redirect to login page
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserDetails(response.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to fetch user details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 4, minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 4, minHeight: "100vh" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 4, minHeight: "100vh" }}>
        <Typography>User not found.</Typography>
      </Box>
    );
  }

  // Ensure the avatar URL is properly formatted
  const avatarUrl = userDetails.avatar ? `http://localhost:5000${userDetails.avatar}` : "";

  return (
    
   <Box sx={{ minHeight: "100vh", bgcolor: "#f9f9f9" }} >
         {/* Navbar */}
         <AppBar position="static" color="primary">
           <Toolbar>
             <Typography variant="h6" sx={{ flexGrow: 1 }}>
               FamLink
             </Typography>
     
             <Button color="inherit" component={Link} to="/groups/new">
               Create Group
             </Button>
             <Button color="inherit" component={Link} to="/groups/mine">
               My Group
             </Button>
             <Button color="inherit" component={Link} to="/events/new">
               Create Event
             </Button>
             <Button color="inherit" component={Link} to="/inbox">
               My Inbox
             </Button>
             <Button color="inherit" component={Link} to="/events/mine">
               My Events
             </Button>
             <Button color="inherit" component={Link} to="/profile">
               Profile
             </Button>
             <Button color="inherit" onClick={handleLogout}>
               Logout
             </Button>
           </Toolbar>
         </AppBar>

      {/* Profile Content */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "#f9f9f9", padding: 4 }}>
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, width: "100%", borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
            <Avatar
              alt={`${userDetails.firstName} ${userDetails.lastName}`}
              src={avatarUrl}
              sx={{ width: 150, height: 150 }}
            >
              {!avatarUrl && userDetails.firstName ? userDetails.firstName[0].toUpperCase() : ""}
            </Avatar>
          </Box>
          <Typography variant="h4" textAlign="center" gutterBottom>
            {userDetails.firstName} {userDetails.lastName}
          </Typography>
          <Box sx={{ marginTop: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              <strong>Birthday:</strong> {userDetails.birthday ? new Date(userDetails.birthday).toLocaleDateString() : "N/A"}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <strong>Phone:</strong> {userDetails.phone || "N/A"}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <strong>Location:</strong> {userDetails.location || "N/A"}
            </Typography>
          </Box>
        </Paper>
      </Box>
      </Box>
    
  );
};

export default MemberProfile;
