const express = require('express');
const registerRouter = require('./register');
const loginRouter = require('./login');

const router = express.Router();

router.use('/register', registerRouter);
router.use('/login', loginRouter);

module.exports = router;
