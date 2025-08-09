import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [newEvent, setNewEvent] = useState({ name: '', dateTime: '', totalSeats: '' });
  const [booking, setBooking] = useState({ userId: '', eventId: '' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserName, setEditingUserName] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingEvent, setEditingEvent] = useState({});
  const [selectedUserEvents, setSelectedUserEvents] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState('');


  const API_URL = 'http://localhost:5000';
  
  const viewUserEvents = (user) => {
  axios.get(`${API_URL}/users/${user.id}/events`)
    .then(res => {
      setSelectedUserEvents(res.data);
      setSelectedUserName(user.name);
    });
};

  // Fetch data
  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  const fetchUsers = () => {
    axios.get(`${API_URL}/users`).then(res => setUsers(res.data));
  };

  const fetchEvents = () => {
    axios.get(`${API_URL}/events`).then(res => setEvents(res.data));
  };

  // Add User
  const addUser = () => {
    if (!newUser) return;
    axios.post(`${API_URL}/users`, { name: newUser }).then(() => {
      setNewUser('');
      fetchUsers();
    });
  };

  // Delete User
  const deleteUser = (id) => {
    axios.delete(`${API_URL}/users/${id}`).then(fetchUsers);
  };

  // Add Event
  const addEvent = () => {
    if (!newEvent.name || !newEvent.dateTime || !newEvent.totalSeats) return;
    axios.post(`${API_URL}/events`, {
      name: newEvent.name,
      dateTime: newEvent.dateTime,
      totalSeats: parseInt(newEvent.totalSeats)
    }).then(() => {
      setNewEvent({ name: '', dateTime: '', totalSeats: '' });
      fetchEvents();
    });
  };

  // Delete Event
  const deleteEvent = (id) => {
    axios.delete(`${API_URL}/events/${id}`).then(fetchEvents);
  };

  // Book Event
  const bookEvent = () => {
    if (!booking.userId || !booking.eventId) return;
    axios.post(`${API_URL}/bookings`, {
      userId: parseInt(booking.userId),
      eventId: parseInt(booking.eventId)
    })
    .then(() => {
      alert('Booking successful!');
      setBooking({ userId: '', eventId: '' });
      fetchEvents();
    })
    .catch(err => {
      alert(err.response.data.message);
    });
  };

  // Availability color
  const getAvailabilityColor = (event) => {
    const available = event.totalSeats - event.bookedSeats;
    if (available <= 0) return 'red';
    if (available < 5) return 'orange';
    return 'green';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Event Booking Dashboard</h1>

     {/* USERS */}
<section>
  <h2>Users</h2>
  <input
    type="text"
    placeholder="Enter name"
    value={newUser}
    onChange={e => setNewUser(e.target.value)}
  />
  <button onClick={addUser}>Add User</button>

  <>
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {editingUserId === user.id ? (
            <>
              <input
                value={editingUserName}
                onChange={e => setEditingUserName(e.target.value)}
              />
              <button onClick={() => {
                axios.put(`${API_URL}/users/${user.id}`, { name: editingUserName }).then(() => {
                  setEditingUserId(null);
                  fetchUsers();
                });
              }}>Save</button>
            </>
          ) : (
            <>
              {user.name}
              <button onClick={() => {
                setEditingUserId(user.id);
                setEditingUserName(user.name);
              }}>Edit</button>
            </>
          )}
          <button onClick={() => deleteUser(user.id)}>Delete</button>
          <button onClick={() => viewUserEvents(user)}>View Events</button>
        </li>
      ))}
    </ul>

    {selectedUserEvents.length > 0 && (
      <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Events booked by {selectedUserName}:</h3>
        <ul>
          {selectedUserEvents.map(event => (
            <li key={event.id}>
              {event.name} - {new Date(event.dateTime).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    )}
</>
</section>

      {/* EVENTS */}
<section>
  <h2>Events</h2>
  <input
    type="text"
    placeholder="Event name"
    value={newEvent.name}
    onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
  />
  <input
    type="datetime-local"
    value={newEvent.dateTime}
    onChange={e => setNewEvent({ ...newEvent, dateTime: e.target.value })}
  />
  <input
    type="number"
    placeholder="Total seats"
    value={newEvent.totalSeats}
    onChange={e => setNewEvent({ ...newEvent, totalSeats: e.target.value })}
  />
  <button onClick={addEvent}>Add Event</button>

  <ul>
    {events.map(event => (
      <li key={event.id}>
        {editingEventId === event.id ? (
          <>
            <input
              type="text"
              value={editingEvent.name}
              onChange={e => setEditingEvent({ ...editingEvent, name: e.target.value })}
            />
            <input
              type="datetime-local"
              value={editingEvent.dateTime}
              onChange={e => setEditingEvent({ ...editingEvent, dateTime: e.target.value })}
            />
            <input
              type="number"
              value={editingEvent.totalSeats}
              onChange={e => setEditingEvent({ ...editingEvent, totalSeats: e.target.value })}
            />
            <button onClick={() => {
              axios.put(`${API_URL}/events/${event.id}`, editingEvent).then(() => {
                setEditingEventId(null);
                fetchEvents();
              });
            }}>Save</button>
          </>
        ) : (
          <>
            <span style={{ color: getAvailabilityColor(event) }}>
              {event.name} - {event.bookedSeats}/{event.totalSeats} seats booked
            </span>
            <button onClick={() => {
              setEditingEventId(event.id);
              setEditingEvent({ ...event });
            }}>Edit</button>
          </>
        )}
        <button onClick={() => deleteEvent(event.id)}>Delete</button>
      </li>
    ))}
  </ul>
</section>


      {/* BOOKINGS */}
      <section>
        <h2>Book Event</h2>
        <select value={booking.userId} onChange={e => setBooking({ ...booking, userId: e.target.value })}>
          <option value="">Select User</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>

        <select value={booking.eventId} onChange={e => setBooking({ ...booking, eventId: e.target.value })}>
          <option value="">Select Event</option>
          {events
            .filter(e => e.bookedSeats < e.totalSeats)
            .map(e => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.totalSeats - e.bookedSeats} left)
              </option>
            ))}
        </select>

        <button onClick={bookEvent}>Book</button>
      </section>
    </div>
  );
}

export default App;
