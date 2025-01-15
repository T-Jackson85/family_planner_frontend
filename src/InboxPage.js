import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, List, ListItem, ListItemText } from "@mui/material";
import api from "./api/api";

const InboxPage = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get("/messages/inbox", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMessages(response.data); // Set fetched messages
      } catch (error) {
        console.error("Error fetching inbox messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleInviteAction = async (groupId, messageId, status) => {
    try {
      await api.put(
        `/groups/${groupId}/join`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessages(messages.filter((msg) => msg.id !== messageId)); // Remove the handled invite
      alert(`Invite ${status.toLowerCase()} successfully.`);
    } catch (error) {
      console.error("Error handling invite:", error);
      alert("Failed to handle invite. Please try again.");
    }
  };
  
  return (
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
                {message.content.includes("You have been invited to join the group") && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleInviteAction(message.id, "APPROVED")}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleInviteAction(message.id, "REJECTED")}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default InboxPage;

