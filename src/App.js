import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventList from "./components/eventComponents/EventList";
import EventDetail from "./components/eventComponents/EventDetail";
import EventForm from "./components/eventComponents/EventForm";
import UserList from './components/userComponents/UserList';
import UserDetail from './components/userComponents/UserDetail';
import UserForm from './components/userComponents/UserForm';
import ExpenseList from "./components/expenseComponents/ExpenseList";
import ExpenseDetails from "./components/expenseComponents/ExpenseDetails";
import ExpenseForm from "./components/expenseComponents/ExpenseForm";
import GroupsList from "./components/groupComponents/GroupsList";
import GroupDetails from "./components/groupComponents/GroupDetails";
import GroupForm from "./components/groupComponents/GroupForm";
import TasksList from "./components/taskComponents/TasksList";
import TaskDetails from "./components/taskComponents/TaskDetails";
import TaskForm from "./components/taskComponents/TaskForm";
import LoginPage from "./LoginPage";
import Homepage from "./homepage";
import SignUpPage from "./SignUpPage";
import UserProfile from './UserProfile'; // Component for the user profile page
import InboxPage from "./InboxPage";
import MyEventsPage from "./MyEventsPage";
import MyGroupPage from "./MyGroupPage";
import EditEventPage from "./EditEventPage";
import GroupJoinPage from "./GroupJoinPage";
import MemberProfile from "./MemberProfile"; // Import the MemberProfile component

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LoginPage />} />
        <Route path="/events" element={<EventList />} /> {/* List Events */}
        <Route path="/events/:id" element={<EventDetail />} /> {/* Event Details */}
        <Route path="/events/new" element={<EventForm />} /> {/* Create Event */}
        <Route path="/events/edit/:id" element={<EventForm />} /> {/* Edit Event */}
        <Route path="/users" element={<UserList />} /> {/* List users */}
        <Route path="/users/:id" element={<UserDetail />} /> {/* User details */}
        <Route path="/users/new" element={<UserForm />} /> {/* Add new user */}
        <Route path="/users/edit/:id" element={<UserForm />} /> {/* Edit user */}
        <Route path="/expenses" element={<ExpenseList />} />
        <Route path="/expenses/:id" element={<ExpenseDetails />} />
        <Route path="/add-expense" element={<ExpenseForm />} />
        <Route path="/edit-expense/:id" element={<ExpenseForm />} />
        <Route path="/groups" element={<GroupsList />} />
        <Route path="/groups/:id" element={<GroupDetails />} />
        <Route path="/add-group" element={<GroupForm />} />
        <Route path="/edit-group/:id" element={<GroupForm />} />
        <Route path="/tasks" element={<TasksList />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/add-task" element={<TaskForm />} />
        <Route path="/edit-task/:id" element={<TaskForm />} />
        <Route path="/users/login" element={<LoginPage />} />
        <Route path="/profile/:id" element={<Homepage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/userprofile/:id" element={<UserProfile />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/groups/new" element={<GroupForm />} />
        <Route path="/groups" element={<GroupsList />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/events/mine" element={<MyEventsPage />} />
        <Route path="/groups/mine" element={<MyGroupPage />} />
        <Route path="/events/edit/:id" element={<EditEventPage />} />
        <Route path="/groups/:groupId/join" element={<GroupJoinPage />} />;
        <Route path="/memberprofile/:userId" element={<MemberProfile />} />
        <Route path="/memberprofile/:userId" element={<MemberProfile />} />
      </Routes>
    </Router>
  );
}



export default App;