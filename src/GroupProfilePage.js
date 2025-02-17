import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import api from "./api/api";

const GroupProfilePage = () => {
  const { groupId } = useParams(); // Get group ID from the URL
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await api.get(`http://localhost:5000/api/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setGroup(response.data);
      } catch (error) {
        console.error("Error fetching group details:", error);
        alert("Group not found.");
      }
    };

    fetchGroup();
  }, [groupId]);

  const handleJoinRequest = async () => {
    try {
      await api.post(
        `http://localhost:5000/api/groups/${groupId}/join`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Request to join group sent successfully!");
    } catch (error) {
      console.error("Error sending join request:", error);
      alert("Failed to send join request.");
    }
  };

  if (!group) return <Typography>Loading group details...</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          {group.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Admins: {group.admins.map((admin) => `${admin.user.firstName} ${admin.user.lastName}`).join(", ")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Members: {group.users.map((user) => `${user.firstName} ${user.lastName}`).join(", ")}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleJoinRequest}>
          Ask to Join
        </Button>
      </Paper>
    </Box>
  );
};

export default GroupProfilePage;
