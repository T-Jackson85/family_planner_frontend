import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

const GroupSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { groups } = location.state || { groups: [] };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      {groups.length > 0 ? (
        <List>
          {groups.map((group) => (
            <ListItem
              key={group.id}
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <ListItemText
                primary={group.name}
                secondary={`Admins: ${group.admins
                  .map((admin) => `${admin.firstName} ${admin.lastName}`)
                  .join(", ")}`}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/groups/${group.id}`)}
              >
                View Group
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No groups found.</Typography>
      )}
    </Container>
  );
};

export default GroupSearchResults;
