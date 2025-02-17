import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import api from "./api/api";

const GroupJoinPage = () => {
  const { groupId } = useParams(); // Retrieve groupId from the route parameter
  const [group, setGroup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await api.get(`/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setGroup(response.data);
      } catch (error) {
        console.error("Error fetching group details:", error);
        alert("Group not found or you do not have access.");
        navigate("/inbox"); // Redirect back to inbox if group is not found
      }
    };

    fetchGroupDetails();
  }, [groupId, navigate]);

  const handleJoinGroup = async (status) => {
    try {
      await api.put(
        `/groups/${groupId}/join`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(`Group join request ${status.toLowerCase()} successfully.`);
      navigate("/groups/mine"); // Redirect to user's groups
    } catch (error) {
      console.error("Error joining group:", error);
      alert("Failed to join the group. Please try again.");
    }
  };

  if (!group) return <Typography>Loading group details...</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Join Group: {group.name}</Typography>
      <Typography variant="body1" sx={{ marginY: 2 }}>
        Are you sure you want to join this group?
      </Typography>
      <Button
        variant="contained"
        color="success"
        onClick={() => handleJoinGroup("APPROVED")}
        sx={{ marginRight: 2 }}
      >
        Accept
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={() => handleJoinGroup("REJECTED")}
      >
        Reject
      </Button>
    </Box>
  );
};

export default GroupJoinPage;
