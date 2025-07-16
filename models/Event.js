const pool = require('../config/database');

class Event {
  static async create(title, dateTime, location, capacity) {
    const query = 'INSERT INTO events (title, date_time, location, capacity) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await pool.query(query, [title, dateTime, location, capacity]);
    return result.rows[0];
  }

  static async getById(id) {
    const query = 'SELECT * FROM events WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAll() {
    const query = 'SELECT * FROM events ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async getUpcoming() {
    const query = `
      SELECT e.*, COUNT(r.id) as current_registrations
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.date_time > NOW()
      GROUP BY e.id
      ORDER BY e.date_time ASC, e.location ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getWithUsers(eventId) {
    const eventQuery = 'SELECT * FROM events WHERE id = $1';
    const eventResult = await pool.query(eventQuery, [eventId]);
    
    if (eventResult.rows.length === 0) {
      return null;
    }

    const usersQuery = `
      SELECT u.id, u.name, u.email, r.registered_at 
      FROM users u 
      JOIN registrations r ON u.id = r.user_id 
      WHERE r.event_id = $1
      ORDER BY r.registered_at
    `;
    const usersResult = await pool.query(usersQuery, [eventId]);

    const event = eventResult.rows[0];
    event.registered_users = usersResult.rows;
    event.current_registrations = usersResult.rows.length;

    return event;
  }

  static async getStats(eventId) {
    const event = await this.getById(eventId);
    if (!event) return null;

    const registrationQuery = 'SELECT COUNT(*) FROM registrations WHERE event_id = $1';
    const registrationResult = await pool.query(registrationQuery, [eventId]);
    
    const totalRegistrations = parseInt(registrationResult.rows[0].count);
    const remainingCapacity = event.capacity - totalRegistrations;
    const percentageUsed = ((totalRegistrations / event.capacity) * 100).toFixed(2);

    return {
      event_id: eventId,
      total_registrations: totalRegistrations,
      remaining_capacity: remainingCapacity,
      capacity_percentage_used: parseFloat(percentageUsed)
    };
  }
}

module.exports = Event;