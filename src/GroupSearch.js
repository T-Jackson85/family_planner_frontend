import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";
import api from "./api/api";

const GroupSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await api.get(`/groups/search`, {
        params: { query: searchQuery },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching groups:", error);
    }
  };

  const handleJoinRequest = async (groupId) => {
    try {
      await api.post(
        `/groups/${groupId}/join`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Request to join group sent successfully!");
    } catch (error) {
      console.error("Error sending join request:", error);
      alert("Failed to send join request. Please try again.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
      <TextField
        label="Search Groups"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2, width: "100%" }}
      />
      <Button variant="contained" onClick={handleSearch} sx={{ mb: 2 }}>
        Search
      </Button>
      <Box sx={{ width: "100%" }}>
        {searchResults.length > 0 ? (
          searchResults.map((group) => (
            <MenuItem key={group.id} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>{group.name}</Typography>
              <Button variant="contained" onClick={() => handleJoinRequest(group.id)}>
                Join Group
              </Button>
            </MenuItem>
          ))
        ) : (
          <Typography>No groups found.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default GroupSearch;


