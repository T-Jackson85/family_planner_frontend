import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MemberList = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    fetchMembers();
  }, []);

  return (
    <ul className="member-list" style={styles.list}>
      {members.map((user) => (
        <li key={user.id} style={styles.item}>
          {/* Link wrapping the avatar */}
          <Link to={`/profile/${user.id}`} style={styles.link}>
            <img
              src={user.avatar || '/default-avatar.png'}
              alt={user.name || "User Avatar"}
              style={styles.avatar}
            />
          </Link>
          {/* Link wrapping the user's name */}
          <Link to={`/profile/${user.id}`} style={styles.nameLink}>
            {user.name || "Unknown User"}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const styles = {
  list: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    width: "120px",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    cursor: "pointer",
    border: "2px solid #ddd",
  },
  nameLink: {
    marginTop: "8px",
    color: "#007bff",
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default MemberList;
