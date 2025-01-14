import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import axios from "axios";

const Navbar = () => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);

  // Fetch members from the API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setMembers(response.data);
        setFilteredMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = members.filter((member) =>
      member.name.toLowerCase().includes(query)
    );
    setFilteredMembers(filtered);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">FamLink</Link>
      </div>
      <div className="navbar-links">
        <Link to="/event-form" className="navbar-link">
          Create Event
        </Link>
        <Link to="/events" className="navbar-link">
          View Events
        </Link>
      </div>
      <div className="navbar-dropdown">
        <button className="dropdown-btn">Members</button>
        <div className="dropdown-content">
          {filteredMembers.map((member) => (
            <Link
              key={member.id}
              to={`/profile/${member.id}`}
              className="dropdown-item"
            >
              {member.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search Members..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
    </nav>
  );
};

export default Navbar;
