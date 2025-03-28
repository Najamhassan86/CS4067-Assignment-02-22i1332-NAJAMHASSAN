import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', availableTickets: '', location: '' });
  const [message, setMessage] = useState('');
  const [showBookings, setShowBookings] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [userNames, setUserNames] = useState({}); // Cache user names
  const [eventTitles, setEventTitles] = useState({}); // Cache event titles
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || 'user123';

  useEffect(() => {
    const { state } = location;
    console.log('Location state:', state);
    const fetchEventsAndUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/events');
        console.log('Fetched events:', response.data);
        setEvents(response.data);
        // Pre-fetch event titles
        const titles = {};
        response.data.forEach(event => titles[event._id] = event.title);
        setEventTitles(titles);
        // Pre-fetch user names for createdBy
        const userIds = [...new Set(response.data.map(event => event.createdBy))];
        const names = { ...userNames };
        for (const uid of userIds) {
          if (!names[uid]) {
            try {
              const userResponse = await axios.get(`http://localhost:5000/users/${uid}`);
              names[uid] = userResponse.data.name;
            } catch (userError) {
              console.error(`Error fetching user ${uid}:`, userError);
              names[uid] = 'Unknown'; // Fallback for failed fetches
            }
          }
        }
        setUserNames(names);
      } catch (error) {
        console.error('Error fetching events:', error);
        setMessage(`Error fetching events: ${error.message}`);
      }
    };
    fetchEventsAndUsers();
  }, [location]);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/events', {
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        availableTickets: parseInt(newEvent.availableTickets, 10),
        location: newEvent.location,
        createdBy: userId,
      });
      setMessage(response.data.message);
      setEvents([...events, { _id: response.data.eventId, ...newEvent, date: new Date(newEvent.date), availableTickets: parseInt(newEvent.availableTickets, 10), createdBy: userId }]);
      setNewEvent({ title: '', description: '', date: '', availableTickets: '', location: '' });
      setShowAddEvent(false);
      setEventTitles({ ...eventTitles, [response.data.eventId]: newEvent.title });
      // Update userNames if needed
      if (!userNames[userId]) {
        const userResponse = await axios.get(`http://localhost:5000/users/${userId}`);
        setUserNames({ ...userNames, [userId]: userResponse.data.name });
      }
    } catch (error) {
      console.error('Error adding event:', error.response?.data || error.message);
      setMessage(`Error adding event: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/bookings/user/${userId}`);
      setBookings(response.data);
      setShowBookings(true);
      // Pre-fetch user names and event titles for bookings
      const userIds = [...new Set([userId, ...response.data.map(booking => booking.userId)])]; // Include logged-in userId
      const eventIds = [...new Set(response.data.map(booking => booking.eventId))];
      const names = { ...userNames };
      const titles = { ...eventTitles };
      for (const uid of userIds) {
        if (!names[uid]) {
          try {
            const userResponse = await axios.get(`http://localhost:5000/users/${uid}`);
            names[uid] = userResponse.data.name || 'Unknown';
          } catch (userError) {
            console.error(`Error fetching user ${uid}:`, userError);
            names[uid] = 'Unknown';
          }
        }
      }
      for (const eid of eventIds) {
        if (!titles[eid]) {
          try {
            const eventResponse = await axios.get(`http://localhost:5001/events/${eid}`);
            titles[eid] = eventResponse.data.title || 'Unknown Event';
          } catch (eventError) {
            console.error(`Error fetching event ${eid}:`, eventError);
            titles[eid] = 'Unknown Event';
          }
        }
      }
      setUserNames(names);
      setEventTitles(titles);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setMessage(`Error fetching bookings: ${error.message}`);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Event Booking Platform</h1>
     
      </header>
      <main className="events-container">

          <button 
  onClick={() => setShowAddEvent(true)} 
  style={{ 
    padding: '12px 20px',
    backgroundColor: '#0056b3',
    background: 'linear-gradient(90deg, #0056b3 0%, #0073e6 100%)',
    color: 'white',
    marginRight: '15px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.95rem',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 86, 179, 0.2)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 86, 179, 0.4)';
    e.currentTarget.style.transform = 'translateY(-3px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 86, 179, 0.2)';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
>
  Add Event
</button>

<button 
  onClick={fetchBookings} 
  style={{ 
    padding: '12px 20px',
    backgroundColor: '#2c3e50',
    background: 'linear-gradient(90deg, #2c3e50 0%, #34495e 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.95rem',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(44, 62, 80, 0.2)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 6px 16px rgba(44, 62, 80, 0.4)';
    e.currentTarget.style.transform = 'translateY(-3px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(44, 62, 80, 0.2)';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
>
  Show My Bookings
</button>
        <h2>Event Listings</h2>
        {showAddEvent && (
          <form onSubmit={handleAddEvent} style={{ marginBottom: '20px', padding: '10px', background: '#f8f9fa' }}>
            <input
              type="text"
              placeholder="Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Available Tickets"
              value={newEvent.availableTickets}
              onChange={(e) => setNewEvent({ ...newEvent, availableTickets: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            />
            <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}>Add Event</button>
            <button type="button" onClick={() => setShowAddEvent(false)} style={{ padding: '10px', marginLeft: '10px' }}>Cancel</button>
          </form>
        )}
        {message && <p>{message}</p>}
        {showBookings && (
  <div className="bookings-section" style={{ 
    marginTop: '30px', 
    marginBottom: '30px',
    padding: '25px 30px', 
    background: 'white', 
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    animation: 'fadeIn 0.5s ease-out',
    maxHeight: '500px',
    overflowY: 'auto'
  }}>
    <h3 style={{
      color: '#2c3e50',
      fontSize: '1.5rem',
      fontWeight: '600',
      marginTop: '0',
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: '2px solid #f0f0f0',
      position: 'relative'
    }}>My Bookings</h3>
    {bookings.length > 0 ? (
      <ul style={{
        listStyleType: 'none',
        padding: '0',
        margin: '0'
      }}>
        {bookings.map((booking) => (
          <li key={booking._id} style={{
            padding: '15px',
            marginBottom: '12px',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #eaeaea',
            fontSize: '0.95rem',
            color: '#5c6780',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
          }}>
            <div style={{ marginBottom: '8px', fontWeight: '600', color: '#0056b3' }}>
              Booking ID: {booking._id}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '500', color: '#2c3e50' }}>Event:</span> 
                <span>{eventTitles[booking.eventId] || 'Loading...'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '500', color: '#2c3e50' }}>Tickets:</span>
                <span>{booking.tickets}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '500', color: '#2c3e50' }}>Status:</span> 
                <span style={{ 
                  padding: '3px 8px', 
                  borderRadius: '4px', 
                  backgroundColor: booking.status === 'Confirmed' ? '#e6f7ee' : '#fff4e6',
                  color: booking.status === 'Confirmed' ? '#0d8a52' : '#e67e22',
                  display: 'inline-block',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>{booking.status}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '500', color: '#2c3e50' }}>Payment:</span> 
                <span style={{ 
                  padding: '3px 8px', 
                  borderRadius: '4px', 
                  backgroundColor: booking.paymentStatus === 'Paid' ? '#e6f7ee' : '#ffecec',
                  color: booking.paymentStatus === 'Paid' ? '#0d8a52' : '#e74c3c',
                  display: 'inline-block',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>{booking.paymentStatus}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '500', color: '#2c3e50' }}>Created by:</span> 
                <span>{userNames[booking.userId] || 'Loading...'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '500', color: '#2c3e50' }}>Created:</span> 
                <span>{new Date(booking.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p style={{
        textAlign: 'center',
        color: '#7f8c8d',
        fontSize: '1.1rem',
        padding: '30px 0',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px dashed #e0e0e0'
      }}>No bookings found.</p>
    )}
    <button onClick={() => setShowBookings(false)} style={{ 
      padding: '10px 20px', 
      marginTop: '20px',
      backgroundColor: '#f1f2f6',
      color: '#5c6780',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#e4e8ef';
      e.currentTarget.style.color = '#2c3e50';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = '#f1f2f6';
      e.currentTarget.style.color = '#5c6780';
    }}
    >Close</button>
  </div>
)}
        {events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                <h3>{event.title} (Created by: {userNames[event.createdBy] || 'Loading...'})</h3>
                <p className="event-date">Date: {new Date(event.date).toLocaleDateString()}</p>
                <p className="event-tickets">Available Tickets: {event.availableTickets}</p>
                <button className="book-button" onClick={() => navigate(`/book/${event._id}`)}>Book Now</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-events">No events available.</p>
        )}
      </main>
    </div>
  );
};

export default EventsPage;