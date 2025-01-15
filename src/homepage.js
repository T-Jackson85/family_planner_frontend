import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";
import api from "./api/api"

// MUI Components
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Paper,
  CircularProgress,
  Container,
  Menu, MenuItem
} from "@mui/material";

// Custom Components
import TaskComponent from "./TaskComponent";
import ExpenseTracker from "./ExpenseTracker";
import MemberList from "./MemberList";

const Homepage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : location.state?.user || null;
  });
  const [date, setDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");



 const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);


  // Rest of your code remains unchanged


  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await api.get(`http://localhost:5000/api/events?month=${date.month() + 1}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEvents(response.data);
      } catch (error) {
        setMessage('Choose at date to display events!');
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
      const formattedDate = newDate.format("YYYY-MM-DD"); // Format the date to send to the backend
      const response = await api.get(
        `http://localhost:5000/api/events?date=${formattedDate}`
      );
      const eventsForDate = response.data;
  
      if (eventsForDate.length > 0) {
        setSelectedEvent(eventsForDate[0]);
        const [tasksResponse, expensesResponse] = await Promise.all([
          api.get(`http://localhost:5000/api/tasks?eventId=${eventsForDate[0].id}`),
          api.get(`http://localhost:5000/api/expenses?eventId=${eventsForDate[0].id}`),
        ]);
        console.log("Tasks:", tasksResponse.data);
        console.log("Expenses:", expensesResponse.data);
  
        setTasks(tasksResponse.data);
        setExpenses(expensesResponse.data);
      } else {
        setTasks([]);
        setExpenses([]);
        setMessage("No events on this date.");
      }
    } catch (error) {
      setMessage("Error fetching data for the selected date. Please try again.");
    }
  };
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await api.get(`/groups/search`, {
        params: { query: searchQuery },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSearchResults(response.data);
      setAnchorEl(document.getElementById("search-input")); // Attach dropdown to the input field
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
      setSearchQuery("");
      setSearchResults([]);
      setAnchorEl(null); // Close dropdown after join
    } catch (error) {
      console.error("Error sending join request:", error);
      alert("Failed to send join request.");
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchResults([]);
  };
  
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await api.post(
        `http://localhost:5000/api/events/${selectedEvent.id}/comments`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSelectedEvent((prev) => ({
        ...prev,
        comments: [...prev.comments, response.data],
      }));
      setNewComment(""); // Clear input
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    navigate('/users/login');
  };
  
  // Check token validity on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || Date.now() >= localStorage.getItem('tokenExpiry')) {
      handleLogout();
    }
  }, [handleLogout]);
  
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
    <TextField
        id="search-input"
        placeholder="Search Groups..."
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        sx={{ bgcolor: "#fff", borderRadius: 1, marginRight: 2 }}
      />
      <Button
        variant="contained"
        size="small"
        onClick={handleSearch}
        sx={{ marginLeft: 1 }}
      >
        Search
      </Button>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && searchResults.length > 0}
        onClose={handleClose}
        sx={{ mt: 1 }}
      >
        {searchResults.map((group) => (
          <MenuItem key={group.id}>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Typography>{group.name}</Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleJoinRequest(group.id)}
              >
                Join
              </Button>
            </Box>
          </MenuItem>
        ))}
        {searchResults.length === 0 && (
          <MenuItem>
            <Typography>No groups found.</Typography>
          </MenuItem>
        )}
      </Menu>
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
    </Button> {/* New Profile button */}
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
              {/* Event Details */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="h6">Event Details</Typography>
                  {selectedEvent ? (
                    <Box>
                      <Typography variant="subtitle1">{selectedEvent.title}</Typography>
                      <Typography variant="body2">{selectedEvent.description}</Typography>
                      <Typography variant="body2">
                        <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Location:</strong>{" "}
                        {selectedEvent.location || "No location specified"}
                      </Typography>

                      {/* Comments Section */}
                      <Box sx={{ marginTop: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Comments
                        </Typography>
                        <Box sx={{ maxHeight: 200, overflowY: "auto", marginBottom: 2 }}>
                          {selectedEvent.comments && selectedEvent.comments.length > 0 ? (
                            selectedEvent.comments.map((comment) => (
                              <Box
                                key={comment.id}
                                sx={{ padding: 1, borderBottom: "1px solid #ddd" }}
                              >
                                <Typography variant="body2">
                                  <strong>{comment.user.firstName}:</strong> {comment.content}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography>No comments yet. Be the first to comment!</Typography>
                          )}
                        </Box>

                        {/* Add Comment */}
                        <TextField
                          fullWidth
                          placeholder="Add a comment"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          variant="outlined"
                          sx={{ marginBottom: 1 }}
                        />
                        <Button variant="contained" onClick={handleCommentSubmit}>
                          Post Comment
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography>No events on this date.</Typography>
                  )}
                </Paper>
              </Grid>

              {/* Tasks Section */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="h6">Tasks</Typography>
                  {tasks.length > 0 ? (
                    <TaskComponent tasks={tasks} />
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
                    <ExpenseTracker expenses={expenses} />
                  ) : (
                    <Typography>No expenses for the selected event.</Typography>
                  )}
                </Paper>
              </Grid>

              {/* Member List */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="h6">Group Members</Typography>
                  <MemberList />
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
        <Box sx={{ padding: 2, bgcolor: "#ffe6e6", borderRadius: 1, textAlign: "center" }}>
          <Typography color="error">{message}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Homepage;

