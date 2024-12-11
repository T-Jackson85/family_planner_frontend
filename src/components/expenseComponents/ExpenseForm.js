import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ExpenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", amount: 0, date: "" });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/expenses/${id}`).then((response) => {
        setFormData(response.data);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = id ? axios.put : axios.post;
    const url = id ? `http://localhost:5000/api/expenses/${id}` : "http://localhost:5000/api/expenses";

    method(url, formData).then(() => {
      navigate("http://localhost:5000/api/expenses");
    });
  };

  return (
    <div>
      <h1>{id ? "Edit Expense" : "Add Expense"}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </label>
        <button type="submit">{id ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
