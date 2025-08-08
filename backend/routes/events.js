const express = require('express');
const router = express.Router();

module.exports = (events) => {
  // Get all events
  router.get('/', (req, res) => {
    res.json(events);
  });

  // Add event
  router.post('/', (req, res) => {
    const newEvent = { id: Date.now(), ...req.body, bookedSeats: 0 };
    events.push(newEvent);
    res.status(201).json(newEvent);
  });

  // Edit event
  router.put('/:id', (req, res) => {
    const event = events.find(e => e.id == req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    Object.assign(event, req.body);
    res.json(event);
  });

  // Delete event
  router.delete('/:id', (req, res) => {
    events = events.filter(e => e.id != req.params.id);
    res.json({ message: 'Event deleted' });
  });

  return router;
};
