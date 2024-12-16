const TaskComponent = ({ tasks }) => {
    return (
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <p>{task.description}</p>
            <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
          </li>
        ))}
      </ul>
    );
  };
  
  export default TaskComponent;
  