import React, { useEffect, useState } from "react";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import api from "./api/api";

const InviteInbox = () => {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const response = await api.get("/groups/requests", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setInvites(response.data);
      } catch (error) {
        console.error("Error fetching invites:", error);
      }
    };

    fetchInvites();
  }, []);

  const handleAction = async (requestId, status) => {
    try {
      await api.put(
        "/messages/:messageId/handle-invite",
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setInvites(invites.filter((invite) => invite.id !== requestId));
      alert(`Invite ${status === 'APPROVED' ? 'accepted' : 'rejected'} successfully.`);
    } catch (error) {
      console.error("Error handling invite:", error);
      alert("Failed to handle invite. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5">Group Invites</Typography>
      {invites.length === 0 ? (
        <Typography>No invites available.</Typography>
      ) : (
        <List>
          {invites.map((invite) => (
            <ListItem key={invite.id} sx={{ display: "flex", justifyContent: "space-between" }}>
              <ListItemText
                primary={`Group: ${invite.group.name}`}
                secondary={`Invited by: ${invite.user.firstName} ${invite.user.lastName}`}
              />
              <Button
                variant="contained"
                color="success"
                onClick={() => handleAction(invite.id, "APPROVED")}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleAction(invite.id, "REJECTED")}
              >
                Reject
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default InviteInbox;
