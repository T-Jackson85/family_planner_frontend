import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditUserForm = () => {
  const { id } = useParams(); // Get the user ID from the route
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    birthday: "",
    location: "",
    avatar: "",
    wallpaper: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${id}`);
        setFormData(response.data);
      } catch (error) {
        setErrorMessage("Failed to fetch user data.");
        console.error(error);
      }
    };

    fetchUser();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/users/${id}`, formData);
      setErrorMessage("");
      alert("User updated successfully!");
      navigate("/users"); // Redirect to user list or another appropriate page
    } catch (error) {
      setErrorMessage("Failed to update user. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Edit User</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Birthday:</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday ? formData.birthday.slice(0, 10) : ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Avatar URL:</label>
          <input
            type="text"
            name="avatar"
            value={formData.avatar || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Wallpaper URL:</label>
          <input
            type="text"
            name="wallpaper"
            value={formData.wallpaper || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditUserForm;
