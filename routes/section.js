const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { validateBody } = require('../middlewares');
const { createSectionSchema } = require('../validation_schema');

// GET All Sections with Grade Levels
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT sections.*, grade_levels.name AS grade_level_name
       FROM sections
       JOIN grade_levels ON sections.grade_level_id = grade_levels.id`,
    );
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET Section by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      `SELECT sections.*, grade_levels.name AS grade_level_name
       FROM sections
       JOIN grade_levels ON sections.grade_level_id = grade_levels.id
       WHERE sections.id = $1 LIMIT 1`,
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Section not found.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET Sections by Grade Level
router.get('/by-grade-level/:grade_level_id', async (req, res) => {
  try {
    const { grade_level_id } = req.params;
    const { rows } = await db.query('SELECT * FROM sections WHERE grade_level_id = $1', [grade_level_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No sections found for this grade level.' });
    }
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// CREATE Section
router.post('/create', validateBody(createSectionSchema), async (req, res) => {
  try {
    const { name, grade_level_id } = req.validatedBody;
    await db.query('INSERT INTO sections (name, grade_level_id) VALUES ($1, $2)', [name, grade_level_id]);
    return res.status(201).json({
      success: true,
      message: 'Section created successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// UPDATE Section
router.put('/update/:id', validateBody(createSectionSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, grade_level_id } = req.validatedBody;

    const { rows } = await db.query('SELECT * FROM sections WHERE id = $1 LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Section not found.' });
    }

    await db.query('UPDATE sections SET name = $1, grade_level_id = $2 WHERE id = $3', [name, grade_level_id, id]);

    return res.status(200).json({
      success: true,
      message: 'Section updated successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE Section
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await db.query('SELECT * FROM sections WHERE id = $1 LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Section not found.' });
    }

    await db.query('DELETE FROM sections WHERE id = $1', [id]);

    return res.status(200).json({
      success: true,
      message: 'Section deleted successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
