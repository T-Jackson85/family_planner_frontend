import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const MemberList = () => {
    const [members, setMembers] = useState([]);
  
    useEffect(() => {
      const fetchMembers = async () => {
        // Placeholder API call
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setMembers(data);
      };
  
      fetchMembers();
    }, []);
  
    return (
      <ul className="member-list">
        {members.map((user) => (
          <li key={user.id}>
            <img src={user.avatar || '/default-avatar.png'} alt={user.name} />
            <Link to={`/profile/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    );
  };
  
  export default MemberList;
  