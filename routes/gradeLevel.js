const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { validateBody } = require('../middlewares');
const { createGradeLevelSchema } = require('../validation_schema');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM grade_levels');
    return res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM grade_levels WHERE id = ? limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Grade Level not found.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/create', validateBody(createGradeLevelSchema), async (req, res) => {
  try {
    const { name, description } = req.validatedBody;
    await db.query('INSERT INTO grade_levels SET ?', { name, description });
    return res.status(201).json({
      success: true,
      message: 'Grade Level created successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/update/:id', validateBody(createGradeLevelSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.validatedBody;
    const [rows] = await db.query('SELECT * FROM grade_levels WHERE id = ? limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Grade Level not found.' });
    }
    await db.query('UPDATE grade_levels SET ? WHERE id = ?', { name, description }, [id]);
    return res.status(200).json({
      success: true,
      message: 'Grade Level updated successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM grade_levels WHERE id = ? limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Grade Level not found.' });
    }
    await db.query('DELETE FROM grade_levels WHERE id = ?', [id]);
    return res.status(200).json({
      success: true,
      message: 'Grade Level deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
