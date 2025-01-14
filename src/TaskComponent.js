import React from 'react';

const TaskComponent = ({ tasks }) => (
  <ul>
    {tasks.map((task) => (
      <li key={task.id}>
        <strong>{task.title}</strong> - {task.status}
      </li>
    ))}
  </ul>
);

export default TaskComponent;
