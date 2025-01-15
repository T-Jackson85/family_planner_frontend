import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Paper, Typography } from "@mui/material";
import api from "../src/api/api";

const EditEventPage = () => {
  const { id } = useParams(); // Event ID from the URL
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    groupId: null,
    tasks: [],
    expenses: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEventDetails({
          ...response.data,
          date: new Date(response.data.date).toISOString().substring(0, 16), // Convert date to datetime-local format
        });
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to fetch event details. Please try again.");
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/events/${id}`, eventDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Event updated successfully!");
      navigate("/events"); // Redirect to events page
    } catch (err) {
      console.error("Error updating event:", err);
      setError("Failed to update event. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Edit Event
        </Typography>
        {error && (
          <Typography variant="body1" color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="title"
            label="Title"
            variant="outlined"
            value={eventDetails.title}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            fullWidth
            name="date"
            label="Date and Time"
            type="datetime-local"
            variant="outlined"
            value={eventDetails.date}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            fullWidth
            name="location"
            label="Location"
            variant="outlined"
            value={eventDetails.location}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            name="description"
            label="Description"
            variant="outlined"
            value={eventDetails.description}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
            multiline
            rows={4}
          />
          <Button variant="contained" color="primary" type="submit" sx={{ marginRight: 2 }}>
            Save Changes
          </Button>
          <Button variant="outlined" onClick={() => navigate("/events")}>
            Cancel
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default EditEventPage;
