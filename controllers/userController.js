const User = require('../models/User');
const { validateUser } = require('../utils/validation');

const userController = {

  async createUser(req, res) {
    try {
      const { name, email } = req.body;
      const validation = validateUser({ name, email });
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }
      const existingUser = await User.getByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const user = await User.create(name, email);
      
      res.status(201).json({
        message: 'User created successfully',
        user: user
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

 
  async getAllUsers(req, res) {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.getById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = userController;