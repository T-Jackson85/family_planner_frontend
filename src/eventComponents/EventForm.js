import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    date: "",
    location: "",
  });

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/events/${id}`);
          setEvent(response.data);
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      };

      fetchEvent();
    }
  }, [id]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/events/${id}`, event);
        alert("Event updated successfully!");
      } else {
        await axios.post("http://localhost:3000/api/events", event);
        alert("Event created successfully!");
      }
      navigate("/events");
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <div>
      <h1>{id ? "Edit Event" : "Create Event"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={event.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="datetime-local"
            name="date"
            value={event.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={event.location}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate("/events")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EventForm;
