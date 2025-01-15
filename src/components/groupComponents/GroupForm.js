import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { io } from "socket.io-client"; // Import Socket.IO client
import api from "../../api/api"; // Axios instance

const socket = io("http://localhost:5000"); // Connect to the Socket.IO server

const GroupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // Email field for invites
  const [invites, setInvites] = useState([]); // List of invited users
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for real-time notifications
    socket.on("new-message", (data) => {
      console.log("New message notification:", data);
    });

    return () => {
      socket.off("new-message"); // Cleanup on unmount
    };
  }, []);

  const handleAddInvite = () => {
    if (email.trim() && !invites.includes(email)) {
      setInvites([...invites, email]);
      setEmail("");
    }
  };

  const handleSendInvite = async (inviteEmail) => {
    try {
      // Fetch the receiver's user ID based on their email
      const { data: receiver } = await api.get(`/users/email/${inviteEmail}`);
      if (!receiver || !receiver.id) {
        throw new Error("User not found");
      }

      // Send a message to the receiver
      const response = await api.post(
        "/messages",
        {
          receiverId: receiver.id,
          content: `You have been invited to join the group: ${name}`,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // Emit a real-time event to notify the invited user
      socket.emit("new-message", {
        receiverId: receiver.id,
        content: response.data.content,
        createdAt: response.data.createdAt,
      });

      console.log("Invite sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending invite:", error);
      setError("Failed to send invite. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the group
      const response = await api.post("/groups", { name, invites });
      if (response.data) {
        // Send invites to all users
        invites.forEach((inviteEmail) => {
          handleSendInvite(inviteEmail);
        });

        navigate("/groups/mine"); // Redirect to user's groups
      } else {
        throw new Error("Failed to create group");
      }
    } catch (err) {
      console.error(err);
      setError("Error creating group. Please try again.");
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, margin: "auto", padding: 3, marginTop: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create a New Group
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Group Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ marginBottom: 2 }}
          required
        />
        <TextField
          fullWidth
          label="Invite Member (Enter Email)"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="outlined" onClick={handleAddInvite} sx={{ marginBottom: 2 }}>
          Add Invite
        </Button>
        <Typography variant="subtitle2">Invites:</Typography>
        {invites.map((invite, index) => (
          <Typography key={index}>{invite}</Typography>
        ))}
        <Button variant="contained" color="primary" type="submit">
          Create Group
        </Button>
      </form>
    </Paper>
  );
};

export default GroupForm;



