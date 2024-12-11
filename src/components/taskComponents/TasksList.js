import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TasksList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/tasks").then((response) => setTasks(response.data));
  }, []);

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  return (
    <div>
      <h1>Tasks</h1>
      <Link to="/add-task">Add Task</Link>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.status}
            <Link to={`/tasks/${task.id}`}>View</Link>
            <Link to={`/edit-task/${task.id}`}>Edit</Link>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksList;
