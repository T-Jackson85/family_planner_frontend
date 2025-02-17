import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import api from "./api/api";

const MemberList = ({ groupId, loggedInUserId }) => {
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (!groupId) return;

      try {
        const response = await api.get(`/groups/${groupId}/details`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const { otherUsers } = response.data;

        const filteredUsers = otherUsers.filter((user) => user.id !== loggedInUserId);

        setGroupMembers(filteredUsers);
      } catch (error) {
        console.error("Error fetching group members:", error);
        setError("Failed to load group members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupMembers();
  }, [groupId, loggedInUserId]);

  if (loading) return <Typography>Loading...</Typography>;

  if (error) return <Typography color="error">{error}</Typography>;

  if (groupMembers.length === 0) {
    return <Typography>No other members in this group.</Typography>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "15px" }}>
      {groupMembers.map((user) => {
        const avatarUrl = user.avatar ? `http://localhost:5000${user.avatar}` : "";

        return (
          <li key={user.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "120px" }}>
            <Link to={`/memberprofile/${user.id}`}>
              <Avatar alt={`${user.firstName} ${user.lastName}`} src={avatarUrl} sx={{ width: 80, height: 80 }}>
                {!avatarUrl && user.firstName ? user.firstName[0].toUpperCase() : ""}
              </Avatar>
            </Link>
            <Link to={`/memberprofile/${user.id}`} style={{ marginTop: "8px", color: "#007bff", textDecoration: "none", fontSize: "14px" }}>
              {user.firstName} {user.lastName}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default MemberList;
