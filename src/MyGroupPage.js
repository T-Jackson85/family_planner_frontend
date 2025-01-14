import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import api from "./api/api"; // Axios instance

const MyGroupPage = () => {
  const [groupData, setGroupData] = useState(null);
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await api.post(`/groups/mine`);
        if (response.data && response.data.length > 0) {
          setGroupData(response.data[0]); // First group
        } else {
          setGroupData(null);
        }
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };

    fetchGroupData();
  }, []);

  const handleAddInvite = () => {
    if (email.trim() && !invites.includes(email)) {
      setInvites([...invites, email]);
      setEmail("");
    }
  };

  const handleInviteSubmit = async () => {
    if (invites.length === 0) {
      setError("Please add at least one email address to invite.");
      return;
    }

    try {
      await api.post(`/groups/${groupData.groupId}/invite`, { invites });
      alert("Invitations sent successfully!");
      setInvites([]);
      setError("");
    } catch (err) {
      console.error("Error sending invites:", err);
      setError("Failed to send invites. Please try again.");
    }
  };

  if (!groupData) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: 4 }}>
        No group details available.
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          {groupData.groupName}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Members and Invites
        </Typography>
        <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupData.members.map((member) => (
                <TableRow key={member.email}>
                  <TableCell>{`${member.firstName} ${member.lastName}`}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>Accepted</TableCell>
                </TableRow>
              ))}
              {groupData.requests.map((request) => (
                <TableRow key={request.email}>
                  <TableCell>{`${request.firstName} ${request.lastName}`}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" gutterBottom>
          Add Members
        </Typography>
        <TextField
          fullWidth
          label="Invite Member (Enter Email)"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="outlined" onClick={handleAddInvite} sx={{ marginBottom: 2 }}>
          Add Invite
        </Button>
        <Typography variant="subtitle2">Pending Invites:</Typography>
        {invites.map((invite, index) => (
          <Typography key={index}>{invite}</Typography>
        ))}
        {error && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
        <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleInviteSubmit}>
          Send Invites
        </Button>
        <Button variant="contained" color="secondary" sx={{ marginTop: 2, marginLeft: 2 }} onClick={() => navigate("/homepage")}>
          Return Home
        </Button>
      </Paper>
    </Box>
  );
};

export default MyGroupPage;
