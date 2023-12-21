// routes/login.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const { Op } = require('sequelize');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    // Validate incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, password } = req.body;

    // Check if the identifier is defined
    if (!identifier) {
      console.error('Identifier is undefined');
      return res.status(400).json({ error: 'Invalid request. Missing identifier.' });
    }

    console.log('Received identifier and password:', identifier, password);

    // Check if the identifier (email or username) exists in the database
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      // Temporary: Remove password check
      console.log(`User not found for identifier: ${identifier}`);
      // Log successful login (for testing purposes)
      console.log(`User logged in successfully (without password check): ${identifier}`);
      // Include the token in the response (for testing purposes)
      const token = 'your_dummy_token';
      res.json({ message: 'Login successful (without password check)', token });
      return;
    }

    // Use a secure secret key from environment variables
    const secretKey = process.env.JWT_SECRET || 'your_secure_secret_key';

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, identifier: user.email || user.username }, secretKey, {
      expiresIn: '1h',
    });

    // Log successful login
    console.log(`User logged in successfully: ${user.email || user.username}`);

    // Include the token in the response
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error in login route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
