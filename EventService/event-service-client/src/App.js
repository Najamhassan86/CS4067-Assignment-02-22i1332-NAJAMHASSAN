import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';
import './App.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const { search } = location;
    const params = queryString.parse(search);
    if (params.events) {
      setEvents(JSON.parse(decodeURIComponent(params.events)));
    } else {
      const fetchEvents = async () => {
        try {
          const response = await axios.get('http://localhost:5001/events', {
            headers: { 'Content-Type': 'application/json' },
          });
          setEvents(response.data);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };
      fetchEvents();
    }
  }, [location]);

  return (
    <div className="App">
      <h1>Event Listings</h1>
      <ul>
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event._id}>
              {event.title} - {new Date(event.date).toLocaleDateString()} (Tickets: {event.availableTickets})
            </li>
          ))
        ) : (
          <p>No events available.</p>
        )}
      </ul>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/events" element={<EventsPage />} />
      </Routes>
    </Router>
  );
};

export default App;