import React, { useEffect, useState } from "react";
import axios from "axios";

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/expenses").then((response) => {
      setExpenses(response.data);
    });
  }, []);

  const deleteExpense = (id) => {
    axios.delete(`http://localhost:5000/api/expenses/${id}`).then(() => {
      setExpenses(expenses.filter((expense) => expense.id !== id));
    });
  };

  return (
    <div>
      <h1>Expenses</h1>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.name} - ${expense.amount}
            <button onClick={() => deleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesList;
