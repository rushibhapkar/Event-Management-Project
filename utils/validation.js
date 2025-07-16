// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// User validation
const validateUser = (userData) => {
  const { name, email } = userData;

  if (!name || !email) {
    return { isValid: false, error: 'Name and email are required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }

  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
};

// Event validation
const validateEvent = (eventData) => {
  const { title, date_time, location, capacity } = eventData;

  if (!title || !date_time || !location || !capacity) {
    return { isValid: false, error: 'All fields are required' };
  }

  if (title.trim().length < 3) {
    return { isValid: false, error: 'Title must be at least 3 characters long' };
  }

  if (location.trim().length < 3) {
    return { isValid: false, error: 'Location must be at least 3 characters long' };
  }

  const capacityNum = parseInt(capacity);
  if (isNaN(capacityNum) || capacityNum <= 0 || capacityNum > 1000) {
    return { isValid: false, error: 'Capacity must be between 1 and 1000' };
  }

  // Check if date_time is valid
  const eventDate = new Date(date_time);
  if (isNaN(eventDate.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  return { isValid: true };
};

module.exports = {
  validateUser,
  validateEvent,
  isValidEmail
};