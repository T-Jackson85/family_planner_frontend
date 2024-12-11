import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ExpenseDetails = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/expenses/${id}`).then((response) => {
      setExpense(response.data);
    });
  }, [id]);

  if (!expense) return <div>Loading...</div>;

  return (
    <div>
      <h1>{expense.name}</h1>
      <p>Amount: ${expense.amount}</p>
      <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
    </div>
  );
};

export default ExpenseDetails;
