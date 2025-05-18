const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { validateBody } = require('../middlewares');
const { createStudentSchema } = require('../validation_schema');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students');
    return res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM students WHERE id = ? limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/by-section/:section_id', async (req, res) => {
  try {
    const { section_id } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM students JOiN users ON students.user_id = users.id WHERE section_id = ? limit 1',
      [section_id],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: true,
        message: 'Student not found.',
      });
    }
    return res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/by-teacher/:teacher_id', async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const [rows] = await db.query(
      `SELECT
    s.id AS student_id,
    s.student_id AS student_code,
    u.name AS student_name,
    gl.name AS grade_level,
    sec.name AS section
FROM
    teachers t
JOIN
    teacher_subjects ts ON t.id = ts.teacher_id
JOIN
    sections sec ON ts.section_id = sec.id
JOIN
    students s ON s.section_id = sec.id
JOIN
    users u ON s.user_id = u.id
JOIN
    grade_levels gl ON s.grade_level_id = gl.id
WHERE
    t.teacher_id = ?  -- Replace with the correct teacher_id
GROUP BY
    s.id;`,
      [teacher_id],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: true,
        message: 'Student not found.',
      });
    }
    return res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/create', validateBody(createStudentSchema), async (req, res) => {
  try {
    const { name, student_id, user_id, grade_level_id, section_id } = req.validatedBody;
    await db.query('INSERT INTO students SET ?', { name, student_id, user_id, grade_level_id, section_id });
    return res.status(201).json({
      success: true,
      message: 'Student created successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/update/:id', validateBody(createStudentSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, student_id, user_id, grade_level_id, section_id } = req.validatedBody;
    const [rows] = await db.query('SELECT * FROM students WHERE id = ? limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    await db.query('UPDATE students SET ? WHERE id = ?', { name, student_id, user_id, grade_level_id, section_id }, [
      id,
    ]);
    return res.status(200).json({
      success: true,
      message: 'Student updated successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM students WHERE id = ? limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    await db.query('DELETE FROM students WHERE id = ?', [id]);
    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
