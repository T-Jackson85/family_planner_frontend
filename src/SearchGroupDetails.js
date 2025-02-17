import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import api from "./api/api";

const socket = io("http://localhost:5000"); // Replace with your backend server URL

const SearchGroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await api.get(`/groups/${groupId}/search`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setGroup(response.data);
      } catch (error) {
        console.error("Error fetching group details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();

    return () => {
      socket.disconnect(); // Cleanup Socket.IO connection
    };
  }, [groupId]);

  const handleRequestToJoin = async () => {
    try {
      await api.post(
        `/groups/${groupId}/requests`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Notify the group admin(s) about the request
      group.admins.forEach((admin) => {
        socket.emit("send-notification", {
          receiverId: admin.id,
          message: `You have a new join request for the group: ${group.name}`,
        });
      });

      alert("Request sent successfully.");
    } catch (error) {
      console.error("Error sending join request:", error);
      alert("Failed to send join request.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!group) {
    return <Typography>No group found.</Typography>;
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        {group.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Admins:{" "}
        {group.admins.map((admin) => `${admin.firstName} ${admin.lastName}`).join(", ")}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleRequestToJoin}>
        Request to Join
      </Button>
    </Container>
  );
};

export default SearchGroupDetails;
