import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import api from "./api/api"

const MemberList = ({ userId }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Fetch groups the user is part of
        const response = await api.get('http://localhost:5000/api/groups');
        const userGroups = response.data.filter((group) =>
          group.users.some((user) => user.id === userId)
        );

        // Extract unique members from all groups
        const uniqueMembers = Array.from(
          new Map(
            userGroups
              .flatMap((group) => group.users)
              .map((user) => [user.id, user]) // Map user.id to user object to remove duplicates
          ).values()
        );

        setMembers(uniqueMembers);
      } catch (err) {
        console.error('Error fetching members:', err);
      }
    };

    fetchMembers();
  }, [userId]);

  return (
    <ul style={styles.list}>
      {members.map((user) => (
        <li key={user.id} style={styles.item}>
          {/* Link wrapping the avatar */}
          <Link to={`/userprofile/${user.id}`} style={styles.link}>
            <Avatar
              alt={user.firstName || 'Unknown User'}
              src={user.avatar || ''}
              sx={{ width: 80, height: 80 }}
            >
              {(!user.avatar && user.firstName) ? user.firstName[0].toUpperCase() : ''}
            </Avatar>
          </Link>
          {/* Link wrapping the user's name */}
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

