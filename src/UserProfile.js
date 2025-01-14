import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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
    return <Typography variant="h6" align="center">Loading user profile...</Typography>;
  }

  return (
    <Box sx={styles.profileContainer}>
      <Avatar
        alt={user.firstName || 'User Avatar'}
        src={user.avatar || ''}
        sx={{ width: 150, height: 150, marginBottom: 2 }}
      >
        {(!user.avatar && user.firstName) ? user.firstName[0].toUpperCase() : ''}
      </Avatar>
      <Typography variant="h4" sx={styles.name}>
        {user.firstName || 'Unknown User'}
      </Typography>
      <Typography variant="body1" sx={styles.email}>
        {user.email || 'Email not available'}
      </Typography>
      <Typography variant="body2" sx={styles.location}>
        {user.location || 'Location not available'}
      </Typography>
      <Typography variant="body2" sx={styles.birthday}>
        {user.birthday || 'Birthday not available'}
      </Typography>
      <Typography variant="body2" sx={styles.phone}>
        {user.phone || 'Phone not available'}
      </Typography>
    </Box>
  );
};

const styles = {
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: 'auto',
    marginTop: '20px',
  },
  name: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  email: {
    color: '#555',
    marginBottom: '5px',
  },
  location: {
    color: '#777',
    marginBottom: '5px',
  },
  birthday: {
    color: '#555',
    marginBottom: '5px',
  },
  phone: {
    color: '#555',
  },
};

export default UserProfile;
