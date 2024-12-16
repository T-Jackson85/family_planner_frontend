

export const getEventsForMonth = async (date) => {
    const response = await fetch(`http://localhost:5000/api/events?month=${date.getMonth() + 1}&year=${date.getFullYear()}`);
    return response.json();
  };
  
  export const getUserTasks = async () => {
    const response = await fetch(`http://localhost:5000/api/tasks`);
    return response.json();
  };
  
  export const getExpenseData = async () => {
    const response = await fetch(`http://localhost:5000/api/expenses`);
    return response.json();
  };

  
  