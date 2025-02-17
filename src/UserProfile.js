import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  AppBar, 
  Toolbar,
  Avatar,
  Input,
} from "@mui/material";
import api from "./api/api"; // Axios instance

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState(""); // Store the image URL
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const endpoint = id
          ? `http://localhost:5000/api/users/${id}`
          : "http://localhost:5000/api/auth/me";
  
        const response = await api.get(endpoint);
        const user = response.data;
  
        setUserData(user);
        setIsCurrentUser(!id);
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setPhone(user.phone || "");
        setLocation(user.location || "");
        setAvatar(user.avatar || ""); // Set user avatar
  
        if (user.groupIds.length > 0) {
          const groupId = user.groupIds[0];
          const groupResponse = await api.get(`/groups/${groupId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
  
          if (groupResponse.data) {
            setGroupName(groupResponse.data.name);
            setGroupId(groupResponse.data.id);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const updatedData = { firstName, lastName, phone, location };
      await api.put("http://localhost:5000/api/update", updatedData);
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;

    try {
      await api.put(
        `/groups/${groupId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert("You have left the group.");
      setGroupName("");
      setGroupId(null);
    } catch (error) {
      console.error("Error leaving group:", error);
      alert("Failed to leave the group. Please try again.");
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("avatar", selectedFile);
  
    try {
      const response = await api.post("http://localhost:5000/api/users/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      //  Set full URL with backend URL
      setAvatar(`http://localhost:5000${response.data.avatar}`);
  
      //  Force reload by adding a timestamp to avoid caching issues
      setAvatar(prevAvatar => `${prevAvatar}?timestamp=${new Date().getTime()}`);
  
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture.");
    }
  };
  

  if (!userData) {
    return <Typography variant="h6" align="center">Loading user profile...</Typography>;
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/users/login");
  };

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
    <Box sx={{ minHeight: "100vh", padding: 4, bgcolor: "#f9f9f9" }}>
      <Paper elevation={3} sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isCurrentUser ? "Update Profile" : "User Profile"}
        </Typography>
        <Avatar
          alt={userData.firstName || "User Avatar"}
          src={avatar || ""}
          sx={{ width: 150, height: 150, margin: "auto", marginBottom: 2 }}
        />
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <Button variant="contained" color="primary" onClick={handleUpload} sx={{ marginTop: 2 }}>
          Upload Picture
        </Button>

        <Typography variant="h4" align="center">
          {userData.firstName} {userData.lastName}
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          {userData.email}
        </Typography>

        {groupName && (
          <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
            Group: {groupName}
          </Typography>
        )}

        {groupId && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleLeaveGroup}
            sx={{ display: "block", margin: "auto", marginTop: 2 }}
          >
            Leave Group
          </Button>
        )}

        {isCurrentUser && (
          <>
            <TextField fullWidth label="First Name" variant="outlined" value={firstName} onChange={(e) => setFirstName(e.target.value)} sx={{ marginBottom: 2 }} />
            <TextField fullWidth label="Last Name" variant="outlined" value={lastName} onChange={(e) => setLastName(e.target.value)} sx={{ marginBottom: 2 }} />
            <TextField fullWidth label="Phone" variant="outlined" value={phone} onChange={(e) => setPhone(e.target.value)} sx={{ marginBottom: 2 }} />
            <TextField fullWidth label="Location" variant="outlined" value={location} onChange={(e) => setLocation(e.target.value)} sx={{ marginBottom: 2 }} />
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 3 }}>
              Save Changes
            </Button>
            <Button variant="outlined" onClick={() => navigate("/homepage")} sx={{ marginLeft: 2 }}>
              Cancel
            </Button>
          </>
        )}
      </Paper>
    </Box>
    </Box>
  );
};

export default UserProfile;
