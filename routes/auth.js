const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateBody } = require('../middlewares');
const { loginSchema } = require('../validation_schema');

router.post('/login', validateBody(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedBody;
    console.log(email, 'email');

    const userResult = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }
    const user = userResult.rows[0];

    // Compare Passwords Using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    let teacherData = {};
    if (user.role === 'teacher') {
      const teacherResult = await db.query('SELECT * FROM teachers WHERE user_id = $1 LIMIT 1', [user.id]);
      teacherData = teacherResult.rows[0] || {};
    }

    const userData = { ...user, teacherData };

    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      success: true,
      message: 'Login successful',
      user: userData,
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
