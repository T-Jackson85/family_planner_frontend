const ExpenseTracker = ({ expenses }) => {
    return (
      <div className="expense-tracker">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            <p>{expense.description}</p>
            <p>Amount: ${expense.amount}</p>
            <p>Due: {new Date(expense.dueDate).toDateString()}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default ExpenseTracker;
  