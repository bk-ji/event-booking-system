# Event Booking System

A full-stack **Event Booking System**.  
It allows users to register for events, manage seat limits, and prevent overbooking — with both **backend** (Node.js + Express) and **frontend** (React).

## Features

### Backend (Node.js + Express)
- CRUD for **Users** and **Events**
- Bookings system with:
  - Preventing overbooking
  - Preventing duplicate bookings
- Lists all events booked by a user
- Mock data for quick setup (easily replaceable with a database)
- CORS-enabled for frontend connection

### Frontend (React)
- View/Add/Edit/Delete Users
- View/Add/Edit/Delete Events
- Color-coded event availability:
  - **Available**
  - **Few Left** (< 5 seats)
  - **Sold Out**
- Book events only if seats are available
- Responsive design for mobile and desktop


## Tech Stack

**Backend**
- Node.js
- Express
- CORS
- Nodemon (dev mode)

**Frontend**
- React (Create React App)
- Axios
- CSS (custom styling)
