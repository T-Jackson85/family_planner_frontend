import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";
import api from "./api/api";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  TextField,
  Box,
  Paper,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import TaskComponent from "./TaskComponent";
import ExpenseTracker from "./ExpenseTracker";
import MemberList from "./MemberList";

const Homepage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const [date, setDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [groupDetails, setGroupDetails] = useState({ otherUsers: [] });
  const [loadingGroupDetails, setLoadingGroupDetails] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newComment, setNewComment] = useState("");

  const groupId = user?.groupIds?.[0];

  // Fetch group details
  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId) return;
      try {
        setLoadingGroupDetails(true);
        const response = await api.get(`/groups/${groupId}/details`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setGroupDetails(response.data);
      } catch (error) {
        console.error("Error fetching group details:", error);
        setMessage("Unable to fetch group details.");
      } finally {
        setLoadingGroupDetails(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/events?month=${date.month() + 1}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEvents(response.data);
      } catch (error) {
        setMessage("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [date]);

  const handleDateChange = async (newDate) => {
    setDate(newDate);
    setSelectedEvent(null);
    setMessage("");
  
    try {
      const formattedDate = newDate.format("YYYY-MM-DD");
      const token = localStorage.getItem("token");
  
      // Fetch events for the selected date
      const response = await api.get(`/events?date=${formattedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eventsForDate = response.data;
  
      if (eventsForDate.length > 0) {
        // Set the first event as selected
        setSelectedEvent(eventsForDate[0]);
  
        // Fetch tasks and expenses for the first event
        const [tasksResponse, expensesResponse] = await Promise.all([
          api.get(`/tasks?eventId=${eventsForDate[0].id}`),
          api.get(`/expenses?eventId=${eventsForDate[0].id}`),
        ]);
  
        setTasks(tasksResponse.data || []);
        setExpenses(expensesResponse.data || []);
      } else {
        setMessage("No events found for this date.");
        setTasks([]);
        setExpenses([]);
      }
    } catch (error) {
      console.error("Failed to fetch events or associated data:", error);
      setMessage("Error fetching events or data.");
    }
  };
  
  const handleCommentSubmit = async (eventId) => {
    if (!newComment.trim()) return;
  
    try {
      const response = await api.post(
        `/events/${eventId}/comments`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      // Ensure selectedEvent is an object before updating
      setSelectedEvent((prev) => {
        if (!prev || typeof prev !== "object") {
          return prev; // If prev is null, undefined, or not an object, return as is
        }
        return {
          ...prev,
          comments: [...(prev.comments || []), response.data], // Append new comment
        };
      });
  
      setNewComment(""); // Reset comment input field
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/users/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9f9f9" }}>
      {/* Navbar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            FamLink
          </Typography>
          {user && (
            <Typography sx={{ marginRight: 2 }}>
              Welcome, {user.firstName} {user.lastName}!
            </Typography>
          )}
         
          <Button color="inherit" component={Link} to="/groups/new">
            Create Group
          </Button>
          <Button color="inherit" component={Link} to="/groups/mine">
            My Group
          </Button>
          <Button color="inherit" component={Link} to="/events/new">
            Create Event
          </Button>
          <Button color="inherit" component={Link} to="/inbox">
            My Inbox
          </Button>
          <Button color="inherit" component={Link} to="/events/mine">
            My Events
          </Button>
          <Button color="inherit" component={Link} to="/profile">
            Profile
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ paddingY: 4 }}>
        <Grid container spacing={4}>
          {/* Calendar Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Calendar
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={date}
                  onChange={handleDateChange}
                  renderDay={(day, selectedDate, pickersDayProps) => {
                    const isEventDay = events.some((event) =>
                      day.isSame(dayjs(event.date), "day")
                    );
                    return (
                      <Box {...pickersDayProps}>
                        <span className={isEventDay ? "calendar-event-indicator" : ""}>
                          {day.date()}
                        </span>
                      </Box>
                    );
                  }}
                />
              </LocalizationProvider>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {/* Group Details */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="h6">Group Members</Typography>
                  {loadingGroupDetails ? (
                    <Typography>Loading group details...</Typography>
                  ) : groupDetails.otherUsers?.length > 0 ? (
                    <MemberList groupId={groupId} loggedInUserId={user.id} />
                  ) : (
                    <Typography>No members in this group yet.</Typography>
                  )}
                </Paper>
              </Grid>

             {/* Event Details */}
             {selectedEvent && (
  <Grid item xs={12}>
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6">Event Details</Typography>
      {Array.isArray(selectedEvent) ? (
        selectedEvent.map((event) => (
          <Box key={event.id} sx={{ marginBottom: 4 }}>
            <Typography variant="subtitle1">{event.title}</Typography>
            <Typography variant="body2">{event.description}</Typography>
            <Typography variant="body2">
              <strong>Date:</strong> {new Date(event.date).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              <strong>Created By:</strong> {event.host?.firstName} {event.host?.lastName || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Group:</strong> {event.group?.name || "N/A"}
            </Typography>
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Comments</Typography>
              {event.comments?.length > 0 ? (
                <List>
                  {event.comments.map((comment, index) => (
                    <ListItem key={index} alignItems="flex-start">
                      <ListItemText
                        primary={`${comment.user?.firstName || "Unknown"}: ${comment.content}`}
                        secondary={new Date(comment.createdAt).toLocaleString()}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No comments yet.</Typography>
              )}
            </Box>
            <Box sx={{ marginTop: 2 }}>
              <TextField
                fullWidth
                placeholder="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCommentSubmit(event.id)}
              >
                Post Comment
              </Button>
            </Box>
          </Box>
        ))
      ) : (
        <Box>
          <Typography variant="subtitle1">{selectedEvent.title}</Typography>
          <Typography variant="body2">{selectedEvent.description}</Typography>
          <Typography variant="body2">
            <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            <strong>Created By:</strong> {selectedEvent.host?.firstName} {selectedEvent.host?.lastName || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>Group:</strong> {selectedEvent.group?.name || "N/A"}
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">Comments</Typography>
            {selectedEvent.comments?.length > 0 ? (
              <List>
                {selectedEvent.comments.map((comment, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemText
                      primary={`${comment.user?.firstName || "Unknown"}: ${comment.content}`}
                      secondary={new Date(comment.createdAt).toLocaleString()}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No comments yet.</Typography>
            )}
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCommentSubmit(selectedEvent.id)}
            >
              Post Comment
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  </Grid>
)}

            {/* Tasks Section */}
<Grid item xs={12}>
  <Paper elevation={3} sx={{ padding: 2 }}>
    <Typography variant="h6">Tasks</Typography>
    {tasks.length > 0 ? (
      <TaskComponent tasks={tasks} setTasks={setTasks} />
    ) : (
      <Typography>No tasks for the selected event.</Typography>
    )}
  </Paper>
</Grid>


              {/* Expenses Section */}
<Grid item xs={12}>
  <Paper elevation={3} sx={{ padding: 2 }}>
    <Typography variant="h6">Expenses</Typography>
    {expenses.length > 0 ? (
      <ExpenseTracker expenses={expenses} setExpenses={setExpenses} />
    ) : (
      <Typography>No expenses for the selected event.</Typography>
    )}
  </Paper>
</Grid>

            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", paddingY: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error Message */}
      {message && (
        <Box
          sx={{
            padding: 2,
            bgcolor: "#ffe6e6",
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Typography color="error">{message}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Homepage;
