import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", description: "", status: "pending" });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/tasks/${id}`).then((response) => setFormData(response.data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = id ? axios.put : axios.post;
    const url = id ? `http://localhost:5000/api/tasks/${id}` : "http://localhost:5000/api/tasks";

    method(url, formData).then(() => navigate("http://localhost:5000/api/tasks"));
  };

  return (
    <div>
      <h1>{id ? "Edit Task" : "Add Task"}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Status:
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <button type="submit">{id ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default TaskForm;
