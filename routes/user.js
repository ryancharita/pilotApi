const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const { signupSchema, searchByEmailSchema } = require('../validation_schema');
const { validateBody, validateQuery } = require('../middlewares');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users');
    return res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/by_email', validateQuery(searchByEmailSchema), async (req, res) => {
  try {
    const { email } = req.validatedQuery;
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1 limit 1', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/create', validateBody(signupSchema), async (req, res) => {
  const { name, email, password, role } = req.validatedBody;
  // Check if user already exists
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  if (rows.length > 0) {
    return res.status(400).json({ error: 'Email is already registered.' });
  }

  // Hash Password and Store User
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = { name, email, password: passwordHash, role };
  await db.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [
    newUser.name,
    newUser.email,
    newUser.password,
    newUser.role,
  ]);

  return res.status(201).json({
    success: true,
    message: 'User registered successfully.',
  });
});

router.put('/update/:id', validateBody(signupSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.validatedBody;

    const userResult = await db.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (email) {
      const emailCheck = await db.query('SELECT id FROM users WHERE email = $1 AND id != $2 LIMIT 1', [email, id]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Email is already in use by another user.' });
      }
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : userResult.rows[0].password;

    await db.query('UPDATE users SET name = $1, email = $2, password = $3, role = $4 WHERE id = $5', [
      name,
      email,
      passwordHash,
      role,
      id,
    ]);

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
    });
  } catch (error) {
    console.error('Error during user update:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Check if user exists
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1 limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Delete User
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
