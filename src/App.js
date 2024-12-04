import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventList from "./eventComponents/EventList";
import EventDetail from "./eventComponents/EventDetail";
import EventForm from "./eventComponents/EventForm";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/events" element={<EventList />} /> {/* List Events */}
        <Route path="/events/:id" element={<EventDetail />} /> {/* Event Details */}
        <Route path="/events/new" element={<EventForm />} /> {/* Create Event */}
        <Route path="/events/edit/:id" element={<EventForm />} /> {/* Edit Event */}
      </Routes>
    </Router>
  );
}



export default App;
