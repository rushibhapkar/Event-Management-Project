const pool = require('../config/database');

class Registration {
  static async create(userId, eventId) {
    const query = 'INSERT INTO registrations (user_id, event_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [userId, eventId]);
    return result.rows[0];
  }
  static async cancel(userId, eventId) {
    const query = 'DELETE FROM registrations WHERE user_id = $1 AND event_id = $2 RETURNING *';
    const result = await pool.query(query, [userId, eventId]);
    return result.rows[0];
  }
  static async exists(userId, eventId) {
    const query = 'SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2';
    const result = await pool.query(query, [userId, eventId]);
    return result.rows.length > 0;
  }
  static async getCountForEvent(eventId) {
    const query = 'SELECT COUNT(*) FROM registrations WHERE event_id = $1';
    const result = await pool.query(query, [eventId]);
    return parseInt(result.rows[0].count);
  }

  static async getByUser(userId) {
    const query = `
      SELECT r.*, e.title, e.date_time, e.location
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = $1
      ORDER BY r.registered_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = Registration;