const express = require('express');
const eventController = require('../controllers/eventController');

const router = express.Router();
router.post('/', eventController.createEvent);
router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/:id', eventController.getEventDetails);
router.get('/:id/stats', eventController.getEventStats);
router.post('/:eventId/register', eventController.registerForEvent);
router.delete('/:eventId/register/:userId', eventController.cancelRegistration);

module.exports = router;