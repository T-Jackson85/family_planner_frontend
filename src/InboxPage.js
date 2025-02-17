import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Typography, Paper, Button, List, AppBar, Toolbar, ListItem, ListItemText } from "@mui/material";
import api from "./api/api";

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get("/messages/inbox", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMessages(response.data); // Set fetched messages
        console.log("Fetched Messages:", response.data);
        console.log(messages);
      } catch (error) {
        console.error("Error fetching inbox messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleInviteAction = (groupId) => {
    if (!groupId) {
      alert("Group ID is missing. Unable to process invitation.");
      return;
    }
  
    // Remove the accepted message from the inbox
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.groupId !== groupId));
  
    // Redirect to the group join page
    navigate(`/groups/${groupId}/join`);
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
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Inbox
        </Typography>

        {messages.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No messages in your inbox.
          </Typography>
        ) : (
          <List>
            {messages.map((message) => (
              <ListItem key={message.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                <ListItemText
                  primary={`${message.sender.firstName} ${message.sender.lastName}`}
                  secondary={message.content}
                />
                {message.groupId && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleInviteAction(message.groupId)}
                  >
                    Accept
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
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

export default InboxPage;
