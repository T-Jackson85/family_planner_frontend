import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Button, Paper, Box, Typography } from "@mui/material";
import api from "./api/api";

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events/mine");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleEditEvent = (eventId) => {
    // Navigate to event edit page
  };

  const handleCancelEvent = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`);
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Error canceling event:", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Events
        </Typography>
        <List>
          {events.map((event) => (
            <ListItem key={event.id}>
              <ListItemText primary={event.title} secondary={event.date} />
              <Button onClick={() => handleEditEvent(event.id)} color="primary">
                Edit
              </Button>
              <Button onClick={() => handleCancelEvent(event.id)} color="error">
                Cancel
              </Button>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default MyEventsPage;
