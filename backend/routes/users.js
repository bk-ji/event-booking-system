const express = require('express');
const router = express.Router();

module.exports = (users, bookings, events) => {
  // Get all users
  router.get('/', (req, res) => {
    res.json(users);
  });

  // Add user
  router.post('/', (req, res) => {
    const newUser = { id: Date.now(), name: req.body.name };
    users.push(newUser);
    res.status(201).json(newUser);
  });

  // Edit user
  router.put('/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = req.body.name;
    res.json(user);
  });

  // Delete user
  router.delete('/:id', (req, res) => {
    users = users.filter(u => u.id != req.params.id);
    res.json({ message: 'User deleted' });
  });

  // Get events booked by a user
  router.get('/:id/events', (req, res) => {
    const userBookings = bookings.filter(b => b.userId == req.params.id);
    const userEvents = userBookings.map(b => events.find(e => e.id == b.eventId));
    res.json(userEvents);
  });

  return router;
};
