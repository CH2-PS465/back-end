const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validationResult } = require('express-validator');

const router = express.Router(); 

router.post('/register', async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashedPassword, username });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, username: newUser.username },
      'your_secure_secret_key',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Registration successful',
      token,
      user: { id: newUser.id, email: newUser.email, username: newUser.username },
    });
  } catch (error) {
    console.error('Error in registration route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;