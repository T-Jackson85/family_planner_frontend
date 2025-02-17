import React, { useEffect, useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  Toolbar,
  TableBody,
  TableCell,
  TableContainer,
  AppBar,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { io } from "socket.io-client"; // Import Socket.IO client
import api from "./api/api"; // Axios instance

const socket = io("http://localhost:5000"); // Initialize Socket.IO client

const MyGroupPage = () => {
  const [groups, setGroups] = useState([]);
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.post(`/groups/mine`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();

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

  const handleInviteSubmit = async (groupId, groupName) => {
    if (invites.length === 0) {
      setError("Please add at least one email address to invite.");
      return;
    }

    try {
      for (const inviteEmail of invites) {
        // Fetch the receiver's user ID based on their email
        const { data: receiver } = await api.get(`/users/email/${inviteEmail}`);
        if (!receiver || !receiver.id) {
          console.error(`User not found for email: ${inviteEmail}`);
          setError(`User with email ${inviteEmail} not found.`);
          continue; // Skip to the next invite
        }

        // Create a GroupRequest entry for the invited user
        await api.post(
          `/groups/${groupId}/requests`,
          { userId: receiver.id },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        // Send a message to the receiver
        socket.emit("new-message", {
          receiverId: receiver.id,
          content: `You have been invited to join the group: ${groupName}`,
        });

        console.log(`Invite sent successfully to ${inviteEmail}`);
      }

      alert("Invitations sent successfully!");
      setInvites([]); // Clear invites
      setError(""); // Clear errors
    } catch (err) {
      console.error("Error sending invites:", err);
      setError("Failed to send invites. Please try again.");
    }
  };
  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
  
    try {
      await api.delete(`/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      // Refresh group list after deletion
      setGroups((prevGroups) => prevGroups.filter((group) => group.groupId !== groupId));
      alert("Group deleted successfully.");
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete group. Please try again.");
    }
  };
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
  
      {/* Add margin-top to create space after Navbar */}
      <Box sx={{ mt: 4 }}> 
        <Typography variant="h4" gutterBottom>
          My Groups
        </Typography>
  
        {groups.map((group) => (
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }} key={group.groupId}>
            <Typography variant="h5" gutterBottom>
              {group.groupName}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              sx={{ marginBottom: 2 }}
              onClick={() => handleDeleteGroup(group.groupId)}
            >
              Delete Group
            </Button>
  
            <Typography variant="subtitle1" gutterBottom>
              Members
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group.members.map((member) => (
                    <TableRow key={member.email}>
                      <TableCell>{`${member.firstName} ${member.lastName}`}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>Accepted</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
  
            <Typography variant="h6" gutterBottom>
              Add Members
            </Typography>
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
            <Typography variant="subtitle2">Pending Invites:</Typography>
            {invites.map((invite, index) => (
              <Typography key={index}>{invite}</Typography>
            ))}
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={() => handleInviteSubmit(group.groupId, group.groupName)}
            >
              Send Invites
            </Button>
          </Paper>
        ))}
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginTop: 2 }}
          onClick={() => navigate("/homepage")}
        >
          Return Home
        </Button>
      </Box>
    </Box>
  );
  
};

export default MyGroupPage;

