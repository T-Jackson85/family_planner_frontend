import React from "react";
import { Switch, List, ListItem, ListItemText, ListItemSecondaryAction } from "@mui/material";
import api from "./api/api";

const ExpenseTracker = ({ expenses, setExpenses }) => {
  const handleTogglePaid = async (expenseId, currentStatus) => {
    try {
      const updatedExpense = await api.put(`/expenses/${expenseId}`, {
        paid: !currentStatus, // Toggle the paid status
      });

      // Update the UI with the new status
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === expenseId ? { ...expense, paid: updatedExpense.data.paid } : expense
        )
      );
    } catch (error) {
      console.error("Error updating expense status:", error);
    }
  };

  return (
    <List>
      {expenses.map((expense) => (
        <ListItem key={expense.id}>
          <ListItemText
            primary={`${expense.description}: $${expense.amount.toFixed(2)}`}
            secondary={expense.paid ? "Paid" : "Unpaid"}
          />
          <ListItemSecondaryAction>
            <Switch
              checked={expense.paid}
              onChange={() => handleTogglePaid(expense.id, expense.paid)}
              color="primary"
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default ExpenseTracker;
