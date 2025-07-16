const express = require('express');
const cors = require('cors');
const { createTables } = require('./database/setup');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
app.use(cors());
app.use(express.json());
createTables();
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Event Management API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      events: '/api/events'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;