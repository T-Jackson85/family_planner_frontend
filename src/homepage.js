import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css';
import './homepage.css'; 
import TaskComponent from './TaskComponent';
import ExpenseTracker from './ExpenseTracker';
import MemberList from './MemberList';
import { getEventsForMonth, getUserTasks, getExpenseData } from './api/homepageApi';

const Homepage = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch homepage data on load
  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const eventsData = await getEventsForMonth(date);
        const userTasks = await getUserTasks();
        const userExpenses = await getExpenseData();

        setEvents(eventsData);
        setTasks(userTasks);
        setExpenses(userExpenses);
      } catch (error) {
        setMessage('Error fetching homepage data. Please try again.');
      }
    };

    fetchHomepageData();
  }, [date]);

  const handleDateClick = (clickedDate) => {
    setDate(clickedDate);
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>FamLink</h1>
      </header>
      
      <main className="homepage-content">
        {/* Calendar Component */}
        <section className="calendar-section">
          <h2>Calendar</h2>
          <Calendar 
            value={date}
            onClickDay={handleDateClick}
            tileContent={({ date }) => {
              const eventForDate = events.find((event) => new Date(event.date).toDateString() === date.toDateString());
              return eventForDate ? <span className="calendar-event-indicator" /> : null;
            }}
          />
          <Link to={`/events?date=${date.toISOString()}`} className="view-events-link">
            View Events for {date.toDateString()}
          </Link>
        </section>

        {/* Task Section */}
        <section className="tasks-section">
          <h2>Today's Tasks</h2>
          {tasks.length > 0 ? (
            <TaskComponent tasks={tasks} />
          ) : (
            <p>No tasks today!</p>
          )}
        </section>

        {/* Expense Tracker Section */}
        <section className="expense-tracker-section">
          <h2>Expense Tracker</h2>
          <ExpenseTracker expenses={expenses} />
        </section>

        {/* Member List */}
        <section className="member-list-section">
          <h2>Group Members</h2>
          <MemberList />
        </section>
      </main>

      {/* Feedback Message */}
      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default Homepage;
