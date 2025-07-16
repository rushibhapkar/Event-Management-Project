# Event Management API

A simple REST API for managing events and user registrations built with Node.js, Express, and PostgreSQL.

## Project Structure

```
event-management-api/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── eventController.js   # Event-related logic
│   └── userController.js    # User-related logic
├── database/
│   └── setup.js            # Database table creation
├── models/
│   ├── Event.js            # Event model
│   ├── Registration.js     # Registration model
│   └── User.js             # User model
├── routes/
│   ├── eventRoutes.js      # Event API routes
│   └── userRoutes.js       # User API routes
├── utils/
│   ├── helpers.js          # Helper functions
│   └── validation.js       # Input validation
├── app.js                  # Express app setup
├── server.js              # Server startup
├── package.json
├── .env
└── README.md
```

## Features

- User management (create, list users)
- Event management (create, view events)
- Event registration system
- Registration cancellation
- Event capacity management
- Upcoming events with custom sorting
- Event statistics

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your PostgreSQL database and update `.env` file:
```
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=Eventdatabase
DB_PORT=5432
```

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Events
- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get event details with registered users
- `GET /api/events/upcoming` - Get upcoming events (sorted by date, then location)
- `GET /api/events/:id/stats` - Get event statistics
- `POST /api/events/:eventId/register` - Register user for event
- `DELETE /api/events/:eventId/register/:userId` - Cancel registration

## Example Usage

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Create Event
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tech Conference 2024",
    "date_time": "2024-06-15T10:00:00Z",
    "location": "New York",
    "capacity": 100
  }'
```

### Register for Event
```bash
curl -X POST http://localhost:3000/api/events/1/register \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1}'
```

## Business Rules

- Event capacity must be between 1 and 1000
- Users cannot register for past events
- Users cannot register twice for the same event
- Registration is not allowed when event is full
- Events are sorted by date (ascending), then by location (alphabetically)

## Database Schema

### Users Table
- id (Primary Key)
- name
- email (Unique)
- created_at

### Events Table
- id (Primary Key)
- title
- date_time
- location
- capacity
- created_at

### Registrations Table
- id (Primary Key)
- user_id (Foreign Key)
- event_id (Foreign Key)
- registered_at
- Unique constraint on (user_id, event_id)