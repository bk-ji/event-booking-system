const express = require('express');
const router = express.Router();

module.exports = (bookings, users, events) => {
  // Book an event
  router.post('/', (req, res) => {
    const { userId, eventId } = req.body;
    const event = events.find(e => e.id == eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.bookedSeats >= event.totalSeats) return res.status(400).json({ message: 'Event is full' });
    if (bookings.some(b => b.userId == userId && b.eventId == eventId))
      return res.status(400).json({ message: 'User already booked this event' });

    const newBooking = { id: Date.now(), userId, eventId };
    bookings.push(newBooking);
    event.bookedSeats++;
    res.status(201).json(newBooking);
  });

  return router;
};
