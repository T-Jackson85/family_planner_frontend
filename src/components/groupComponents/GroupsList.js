import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, List, ListItem, ListItemText, Typography, Box, Paper } from "@mui/material";
import api from "../../api/api";

const GroupsList = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("http://localhost:5000/api/groups");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, []);

  const handleJoinRequest = async (groupId) => {
    try {
      await api.post(`http://localhost:5000/api/groups/${groupId}/join`);
      alert("Request sent to group admin.");
    } catch (error) {
      alert("Error sending join request.");
    }
  };

  const deleteGroup = async (id) => {
    try {
      await api.delete(`http://localhost:5000/api/groups/${id}`);
      setGroups(groups.filter((group) => group.id !== id));
    } catch (error) {
      alert("Error deleting group.");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Groups
        </Typography>
        <Button
          component={Link}
          to="/add-group"
          variant="contained"
          color="primary"
          sx={{ marginBottom: 2 }}
        >
          Add Group
        </Button>
        <List>
          {groups.map((group) => (
            <ListItem
              key={group.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ListItemText primary={group.name} />
              <Box>
                <Button
                  component={Link}
                  to={`/groups/${group.id}`}
                  variant="text"
                  sx={{ marginRight: 1 }}
                >
                  View
                </Button>
                <Button
                  component={Link}
                  to={`/edit-group/${group.id}`}
                  variant="text"
                  sx={{ marginRight: 1 }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteGroup(group.id)}
                  variant="outlined"
                  color="error"
                  sx={{ marginRight: 1 }}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => handleJoinRequest(group.id)}
                  variant="outlined"
                  color="primary"
                >
                  Request to Join
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default GroupsList;
