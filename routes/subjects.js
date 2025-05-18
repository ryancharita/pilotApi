const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { validateBody } = require('../middlewares');
const { createSubjectSchema } = require('../validation_schema');

// GET All Subjects
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM subjects');
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET Subject by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM subjects WHERE id = $1 LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET Subject by Code
router.get('/by-code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { rows } = await db.query('SELECT * FROM subjects WHERE code = $1 LIMIT 1', [code]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// CREATE Subject
router.post('/create', validateBody(createSubjectSchema), async (req, res) => {
  try {
    const { name, code, description } = req.validatedBody;
    await db.query('INSERT INTO subjects (name, code, description) VALUES ($1, $2, $3)', [name, code, description]);
    return res.status(201).json({
      success: true,
      message: 'Subject created successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// UPDATE Subject
router.put('/update/:id', validateBody(createSubjectSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.validatedBody;

    const { rows } = await db.query('SELECT * FROM subjects WHERE id = $1 LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found.' });
    }

    await db.query('UPDATE subjects SET name = $1, code = $2, description = $3 WHERE id = $4', [
      name,
      code,
      description,
      id,
    ]);

    return res.status(200).json({
      success: true,
      message: 'Subject updated successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE Subject
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await db.query('SELECT * FROM subjects WHERE id = $1 LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found.' });
    }

    await db.query('DELETE FROM subjects WHERE id = $1', [id]);

    return res.status(200).json({
      success: true,
      message: 'Subject deleted successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
