import React from "react";
import { List, ListItem, ListItemText, Switch } from "@mui/material";
import api from "./api/api";

const TaskComponent = ({ tasks, setTasks }) => {
  const handleToggle = async (taskId, currentStatus) => {
    // Determine the new status
    const newStatus = currentStatus === "DONE" ? "TODO" : "DONE";

    try {
      // Update status in database
      await api.put(`/tasks/${taskId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Update UI state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <List>
      {tasks.map((task) => (
        <ListItem key={task.id} divider>
          <ListItemText
            primary={task.title}
            secondary={`Status: ${task.status}`}
          />
          <Switch
            checked={task.status === "DONE"}
            onChange={() => handleToggle(task.id, task.status)}
            color="primary"
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TaskComponent;
