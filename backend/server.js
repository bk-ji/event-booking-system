const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Mock Data
let users = [{ id: 1, name: 'Aditi Sharma' }];
let events = [{ id: 101, name: 'Tech Summit 2025', dateTime: '2025-07-15T10:00:00', totalSeats: 100, bookedSeats: 98 }];
let bookings = [{ id: 501, userId: 1, eventId: 101 }];

// Routes
app.use('/users', require('./routes/users')(users, bookings, events));
app.use('/events', require('./routes/events')(events));
app.use('/bookings', require('./routes/bookings')(bookings, users, events));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
