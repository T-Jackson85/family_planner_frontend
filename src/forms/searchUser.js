import React, { useState, useEffect } from "react";
import axios from "axios";

const UserSearch = () => {
  const [users, setUsers] = useState([]); // Stores the list of all users
  const [searchQuery, setSearchQuery] = useState(""); // The search term
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered user list

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
  };

  return (
    <div>
      <h1>Search Users</h1>
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div>
        {filteredUsers.length > 0 ? (
          <ul>
            {filteredUsers.map((user) => (
              <li key={user.id}>
                <p>
                  <strong>Name:</strong> {user.firstName} {user.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserSearch;

