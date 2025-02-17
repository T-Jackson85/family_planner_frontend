import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Button, Typography, Paper, List, ListItem, AppBar, Toolbar, ListItemText } from "@mui/material";
import api from "../src/api/api";

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("http://localhost:5000/api/events/mine", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEditEvent = (eventId) => {
    navigate(`/events/edit/${eventId}`); // Redirect to EditEventPage with event ID
  };

  const handleCancelEvent = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEvents(events.filter((event) => event.id !== eventId)); // Remove the canceled event
    } catch (error) {
      console.error("Error canceling event:", error);
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
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Events
        </Typography>
        {events.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No events available.
          </Typography>
        ) : (
          <List>
            {events.map((event) => (
              <ListItem key={event.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                <ListItemText
                  primary={event.title}
                  secondary={`Date: ${new Date(event.date).toLocaleString()}`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditEvent(event.id)} // Redirect to edit page
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleCancelEvent(event.id)} // Cancel event
                >
                  Cancel
                </Button>
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

export default MyEventsPage;
