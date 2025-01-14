import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../api/api";
import "./EventForm.css"; // For custom styles

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    title: "",
    date: "",
    location: "",
    groupName: "",
    description: "",
    tasks: "",
    expenses: [],
  });

  const [newExpense, setNewExpense] = useState({ description: "", amount: "" });

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const response = await api.get(`http://localhost:5000/api/events/${id}`);
          const data = response.data;
          setEvent({
            title: data.title,
            date: dayjs(data.date).format("YYYY-MM-DDTHH:mm"),
            location: data.location,
            groupName: data.group?.name || "",
            description: data.description || "",
            tasks: data.tasks.map((task) => task.title).join("\n"),
            expenses: data.expenses || [],
          });
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      };

      fetchEvent();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setEvent((prev) => ({
        ...prev,
        expenses: [...prev.expenses, { ...newExpense, amount: parseFloat(newExpense.amount) }],
      }));
      setNewExpense({ description: "", amount: "" });
    } else {
      alert("Please fill in both description and amount for the expense.");
    }
  };

  const removeExpense = (index) => {
    setEvent((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: event.title,
      date: new Date(event.date).toISOString(),
      location: event.location,
      description: event.description,
      groupId: event.groupName ? await getGroupId(event.groupName) : null,
      tasks: event.tasks.split("\n").map((taskTitle) => ({
        title: taskTitle.trim(),
        status: "TODO", // Default status
      })),
      expenses: event.expenses,
    };

    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

      if (id) {
        await api.put(`http://localhost:5000/api/events/${id}`, payload, { headers });
        alert("Event updated successfully!");
      } else {
        await api.post("http://localhost:5000/api/events", payload, { headers });
        alert("Event created successfully!");
      }

      navigate("/homepage");
    } catch (error) {
      console.error("Error saving event:", error);
      alert("An error occurred while saving the event.");
    }
  };

  const getGroupId = async (groupName) => {
    try {
      const response = await api.get(`http://localhost:5000/api/groups`, {
        params: { name: groupName },
      });
      if (response.data.length > 0) {
        return response.data[0].id;
      } else {
        const newGroup = await api.post(`http://localhost:5000/api/groups`, { name: groupName });
        return newGroup.data.id;
      }
    } catch (error) {
      console.error("Error fetching or creating group:", error);
      return null;
    }
  };

  return (
    <div className="event-form-container">
      <h1>{id ? "Edit Event" : "Create Event"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" name="title" value={event.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="datetime-local" name="date" value={event.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input type="text" name="location" value={event.location} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Group Name:</label>
          <input type="text" name="groupName" value={event.groupName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={event.description} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Tasks:</label>
          <textarea name="tasks" value={event.tasks} onChange={handleChange} placeholder="Enter tasks separated by new lines" />
        </div>
        <div className="form-group">
          <label>Expenses:</label>
          <div className="expense-inputs">
            <input
              type="text"
              name="description"
              value={newExpense.description}
              onChange={handleExpenseChange}
              placeholder="Description"
            />
            <input
              type="number"
              name="amount"
              value={newExpense.amount}
              onChange={handleExpenseChange}
              placeholder="Amount"
            />
            <button type="button" onClick={addExpense}>Add Expense</button>
          </div>
          <ul>
            {event.expenses.map((expense, index) => (
              <li key={index}>
                {expense.description}: ${expense.amount.toFixed(2)}{" "}
                <button type="button" onClick={() => removeExpense(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="form-buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate("/homepage")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;


