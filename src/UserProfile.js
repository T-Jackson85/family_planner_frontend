import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { id } = useParams(); // Extract user ID from the route parameter
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div style={styles.profileContainer}>
      <img
        src={user.avatar || '/default-avatar.png'}
        alt={user.name || 'User Avatar'}
        style={styles.avatar}
      />
      <h2 style={styles.name}>{user.name || 'Unknown User'}</h2>
      <p style={styles.email}>{user.email}</p>
      <p style={styles.location}>{user.location || 'Location not available'}</p>
    </div>
  );
};

const styles = {
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px',
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #ddd',
  },
  name: {
    marginTop: '15px',
    fontSize: '24px',
  },
  email: {
    color: '#555',
  },
  location: {
    color: '#777',
  },
};

export default UserProfile;
