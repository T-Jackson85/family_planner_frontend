import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching user:', err));
  }, [id]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <Avatar
        alt={user.firstName}
        src={user.avatar || ''}
        sx={{ width: 80, height: 80, margin: 'auto' }}
      >
        {(!user.avatar && user.firstName) ? user.firstName[0].toUpperCase() : ''}
      </Avatar>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Location: {user.location}</p>
      <Link to={`/users/edit/${id}`}>Edit</Link>
      <Link to="/profile/:id">Back</Link>
    </div>
  );
}

export default UserDetail;
