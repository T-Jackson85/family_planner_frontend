import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]); // State to hold the list of users
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch the list of users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrorMessage("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  // Delete user function
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id)); // Update the UI after deletion
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage("Failed to delete user. Please try again.");
    }
  };

  return (
    <div>
      <h1>User List</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <div>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <p>
                  <strong>{user.firstName} {user.lastName}</strong> ({user.email})
                </p>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default UserList;
