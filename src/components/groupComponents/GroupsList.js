import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const GroupsList = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/groups").then((response) => setGroups(response.data));
  }, []);

  const deleteGroup = (id) => {
    axios.delete(`http://localhost:5000/api/groups/${id}`).then(() => {
      setGroups(groups.filter((group) => group.id !== id));
    });
  };

  return (
    <div>
      <h1>Groups</h1>
      <Link to="/add-group">Add Group</Link>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            {group.name}
            <Link to={`/groups/${group.id}`}>View</Link>
            <Link to={`/edit-group/${group.id}`}>Edit</Link>
            <button onClick={() => deleteGroup(group.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupsList;
