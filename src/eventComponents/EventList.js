import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Event List</h1>
      <Link to="/events/new">Create New Event</Link>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`}>{event.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
