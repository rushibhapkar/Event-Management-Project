// Check if date is in the future
const isFutureDate = (dateTime) => {
  return new Date(dateTime) > new Date();
};

// Format date for display
const formatDate = (dateTime) => {
  return new Date(dateTime).toLocaleString();
};

// Calculate time difference
const getTimeDifference = (date1, date2) => {
  return Math.abs(new Date(date1) - new Date(date2));
};

module.exports = {
  isFutureDate,
  formatDate,
  getTimeDifference
};