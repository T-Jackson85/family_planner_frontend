import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "./api/api"; // Use your Axios instance

const InboxPage = () => {
  const [requests, setRequests] = useState([]); // State to store requests
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/groups/requests', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setRequests(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setRequests([]); // Handle no requests gracefully
        } else {
          console.error('Error fetching requests:', error);
        }
      }
    };

    fetchRequests();
  }, []); // Run on component mount

  const handleRequestAction = async (requestId, action) => {
    try {
      await api.put(`/groups/requests/${requestId}`, { status: action });
      setRequests(requests.filter((request) => request.id !== requestId)); // Remove handled request
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Inbox
        </Typography>

        {requests.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No messages
          </Typography>
        ) : (
          <List>
            {requests.map((request) => (
              <ListItem key={request.id}>
                <ListItemText
                  primary={`${request.group.name} - ${request.user.firstName} ${request.user.lastName}`}
                  secondary={`Request: ${request.status}`}
                />
                <Button
                  onClick={() => handleRequestAction(request.id, "APPROVED")}
                  color="success"
                  sx={{ marginRight: 1 }}
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleRequestAction(request.id, "REJECTED")}
                  color="error"
                >
                  Reject
                </Button>
              </ListItem>
            ))}
          </List>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/homepage")}
          sx={{ marginTop: 2 }}
        >
          Return Home
        </Button>
      </Paper>
    </Box>
  );
};

export default InboxPage;
