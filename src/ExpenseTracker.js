import React from 'react';

const ExpenseTracker = ({ expenses }) => (
  <ul>
    {expenses.map((expense) => (
      <li key={expense.id}>
        <strong>{expense.description || 'No description'}</strong>: ${expense.amount} -{' '}
        {expense.paid ? 'Paid' : 'Unpaid'}
      </li>
    ))}
  </ul>
);

export default ExpenseTracker;
