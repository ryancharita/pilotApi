const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { validateBody } = require('../middlewares');
const { createSubjectSchema, createSubjectSectionSchema } = require('../validation_schema');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM subjects');
    return res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM subjects WHERE id = ? limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/by-code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const [rows] = await db.query('SELECT * FROM subjects WHERE code = ? limit 1', [code]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/create', validateBody(createSubjectSchema), async (req, res) => {
  try {
    const { name, code, description } = req.validatedBody;
    await db.query('INSERT INTO subjects SET ?', { name, code, description });
    return res.status(201).json({
      success: true,
      message: 'Subject created successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/update/:id', validateBody(createSubjectSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.validatedBody;
    const [rows] = await db.query('SELECT * FROM subjects WHERE id = ? limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    await db.query('UPDATE subjects SET ? WHERE id = ?', { name, code, description }, [id]);
    return res.status(200).json({
      success: true,
      message: 'Subject updated successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM subjects WHERE id = ? limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    await db.query('DELETE FROM subjects WHERE id = ?', [id]);
    return res.status(200).json({
      success: true,
      message: 'Subject deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
