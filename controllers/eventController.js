const Event = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');
const { validateEvent } = require('../utils/validation');
const { isFutureDate } = require('../utils/helpers');

const eventController = {
  
  async createEvent(req, res) {
    try {
      const { title, date_time, location, capacity } = req.body;
      const validation = validateEvent({ title, date_time, location, capacity });
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }

      if (!isFutureDate(date_time)) {
        return res.status(400).json({ error: 'Event date must be in the future' });
      }

      const event = await Event.create(title, date_time, location, capacity);
      
      res.status(201).json({
        message: 'Event created successfully',
        event_id: event.id,
        event: event
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getEventDetails(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.getWithUsers(id);
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async registerForEvent(req, res) {
    try {
      const { eventId } = req.params;
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
      }


      const userExists = await User.exists(user_id);
      if (!userExists) {
        return res.status(404).json({ error: 'User not found' });
      }

   
      const event = await Event.getById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

 
      if (!isFutureDate(event.date_time)) {
        return res.status(400).json({ error: 'Cannot register for past events' });
      }

      const alreadyRegistered = await Registration.exists(user_id, eventId);
      if (alreadyRegistered) {
        return res.status(400).json({ error: 'User already registered for this event' });
      }


      const currentRegistrations = await Registration.getCountForEvent(eventId);
      if (currentRegistrations >= event.capacity) {
        return res.status(400).json({ error: 'Event is full' });
      }

      const registration = await Registration.create(user_id, eventId);
      
      res.status(201).json({
        message: 'Registration successful',
        registration: registration
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },


  async cancelRegistration(req, res) {
    try {
      const { eventId, userId } = req.params;

      const registration = await Registration.cancel(userId, eventId);
      
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }

      res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
      console.error('Error cancelling registration:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },


  async getUpcomingEvents(req, res) {
    try {
      const events = await Event.getUpcoming();
      res.json(events);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getEventStats(req, res) {
    try {
      const { id } = req.params;
      const stats = await Event.getStats(id);
      
      if (!stats) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json(stats);
    } catch (error) {
      console.error('Error fetching event stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = eventController;