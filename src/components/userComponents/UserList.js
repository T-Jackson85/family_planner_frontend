import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <Link to="/users/new">Add New User</Link>
      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Avatar
              alt={user.firstName}
              src={user.avatar || ''}
              sx={{ marginRight: '10px' }}
            >
              {(!user.avatar && user.firstName) ? user.firstName[0].toUpperCase() : ''}
            </Avatar>
            <Link to={`/users/${user.id}`}>{user.firstName} {user.lastName}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
