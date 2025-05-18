const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { validateBody } = require('../middlewares');
const { createSectionSchema } = require('../validation_schema');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM sections JOIN grade_levels ON sections.grade_level_id = grade_levels.id',
    );
    return res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM sections JOIN grade_levels ON sections.grade_level_id = grade_levels.id WHERE id = ? limit 1',
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Section not found.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/by-grade-level/:grade_level_id', async (req, res) => {
  try {
    const { grade_level_id } = req.params;
    const [rows] = await db.query('SELECT * FROM sections WHERE grade_level_id = ? limit 1', [grade_level_id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: true,
        message: 'Section not found.',
      });
    }
    return res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/create', validateBody(createSectionSchema), async (req, res) => {
  try {
    const { name, grade_level_id } = req.validatedBody;
    await db.query('INSERT INTO sections SET ?', { name, grade_level_id });
    return res.status(201).json({
      success: true,
      message: 'Section created successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/update/:id', validateBody(createSectionSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, grade_level_id } = req.validatedBody;
    const [rows] = await db.query('SELECT * FROM sections WHERE id = ? limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Section not found.' });
    }
    await db.query('UPDATE sections SET ? WHERE id = ?', { name, grade_level_id }, [id]);
    return res.status(200).json({
      success: true,
      message: 'Section updated successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM sections WHERE id = ? limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Section not found.' });
    }
    await db.query('DELETE FROM sections WHERE id = ?', [id]);
    return res.status(200).json({
      success: true,
      message: 'Section deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
