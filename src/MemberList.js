import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import api from './api/api';

const MemberList = ({ groupId }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Fetch members of the specified group
        const response = await api.get(`/groups/${groupId}/members`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
  
        setMembers(response.data.users); // Set the members of the group
      } catch (err) {
        console.error('Error fetching members:', err);
      }
    };
  
    fetchMembers();
  }, [groupId]);
  

  return (
    <ul style={styles.list}>
      {members.map((user) => (
        <li key={user.id} style={styles.item}>
          <Link to={`/userprofile/${user.id}`} style={styles.link}>
            <Avatar
              alt={user.firstName || 'Unknown User'}
              src={user.avatar || ''}
              sx={{ width: 80, height: 80 }}
            >
              {(!user.avatar && user.firstName) ? user.firstName[0].toUpperCase() : ''}
            </Avatar>
          </Link>
          <Link to={`/userprofile/${user.id}`} style={styles.nameLink}>
            {user.firstName || 'Unknown User'}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const styles = {
  list: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '120px',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  nameLink: {
    marginTop: '8px',
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '14px',
  },
};

export default MemberList;

