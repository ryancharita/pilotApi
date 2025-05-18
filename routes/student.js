const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { validateBody } = require('../middlewares');
const { createStudentSchema } = require('../validation_schema');

// GET All Students
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM students');
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET Student by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM students WHERE id = $1 LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET Students by Section
router.get('/by-section/:section_id', async (req, res) => {
  try {
    const { section_id } = req.params;
    const { rows } = await db.query(
      `SELECT s.*, u.name AS user_name
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.section_id = $1`,
      [section_id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No students found for this section.' });
    }
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET Students by Teacher
router.get('/by-teacher/:teacher_id', async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const { rows } = await db.query(
      `SELECT
        s.id AS student_id,
        s.student_id AS student_code,
        u.name AS student_name,
        gl.name AS grade_level,
        sec.name AS section
       FROM teachers t
       JOIN teacher_subjects ts ON t.id = ts.teacher_id
       JOIN sections sec ON ts.section_id = sec.id
       JOIN students s ON s.section_id = sec.id
       JOIN users u ON s.user_id = u.id
       JOIN grade_levels gl ON s.grade_level_id = gl.id
       WHERE t.teacher_id = $1
       GROUP BY s.id, u.name, gl.name, sec.name`,
      [teacher_id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No students found for this teacher.' });
    }
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// CREATE Student
router.post('/create', validateBody(createStudentSchema), async (req, res) => {
  try {
    const { name, student_id, user_id, grade_level_id, section_id } = req.validatedBody;
    await db.query(
      'INSERT INTO students (name, student_id, user_id, grade_level_id, section_id) VALUES ($1, $2, $3, $4, $5)',
      [name, student_id, user_id, grade_level_id, section_id],
    );
    return res.status(201).json({ success: true, message: 'Student created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// UPDATE Student
router.put('/update/:id', validateBody(createStudentSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, student_id, user_id, grade_level_id, section_id } = req.validatedBody;

    const { rows } = await db.query('SELECT * FROM students WHERE id = $1 LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    await db.query(
      `UPDATE students
       SET name = $1, student_id = $2, user_id = $3, grade_level_id = $4, section_id = $5
       WHERE id = $6`,
      [name, student_id, user_id, grade_level_id, section_id, id],
    );

    return res.status(200).json({ success: true, message: 'Student updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE Student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM students WHERE id = $1 LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    await db.query('DELETE FROM students WHERE id = $1', [id]);

    return res.status(200).json({ success: true, message: 'Student deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
