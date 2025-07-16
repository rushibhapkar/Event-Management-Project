const pool = require('../config/database');

class User {
  static async create(name, email) {
    const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [name, email]);
    return result.rows[0];
  }

  static async getAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async exists(id) {
    const user = await this.getById(id);
    return !!user;
  }
}

module.exports = User;