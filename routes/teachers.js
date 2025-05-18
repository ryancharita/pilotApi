const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { validateBody } = require('../middlewares');
const { createTeacherSchema, createTeacherSubjectSchema } = require('../validation_schema');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM teachers JOIN users ON teachers.user_id = users.id');
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
      'SELECT * FROM teachers JOIN users ON teachers.user_id = users.id WHERE id = ? limit 1',
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/create', validateBody(createTeacherSchema), async (req, res) => {
  try {
    const { teacher_id, user_id } = req.validatedBody;
    const [rows] = await db.query('SELECT * FROM users WHERE id = ? limit 1', [user_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    await db.query('INSERT INTO teachers SET ?', { teacher_id, user_id });
    return res.status(201).json({
      success: true,
      message: 'Teacher created successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/update/:id', validateBody(createTeacherSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { teacher_id, user_id } = req.validatedBody;
    const [rows] = await db.query('SELECT * FROM teachers WHERE id = ? limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    await db.query('UPDATE teachers SET ? WHERE id = ?', { teacher_id, user_id }, [id]);
    return res.status(200).json({
      success: true,
      message: 'Teacher updated successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM teachers WHERE id = ? limit 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    await db.query('DELETE FROM teachers WHERE id = ?', [id]);
    return res.status(200).json({ message: 'Teacher deleted successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/subjects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT s.*, ts.section_id, sec.name as section_name
      FROM teacher_subjects ts
      JOIN subjects s ON ts.subject_id = s.id
      JOIN sections sec ON ts.section_id = sec.id
      WHERE ts.teacher_id = ?`,
      [id],
    );
    return res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/subjects/create', validateBody(createTeacherSubjectSchema), async (req, res) => {
  try {
    const { teacher_id, subject_id, section_id } = req.validatedBody;
    const [rows] = await db.query('SELECT * FROM teachers WHERE id = ? limit 1', [teacher_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    const [rows1] = await db.query('SELECT * FROM subjects WHERE id = ? limit 1', [subject_id]);
    if (rows1.length === 0) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    const [rows2] = await db.query('SELECT * FROM teachers_subjects WHERE teacher_id = ? AND subject_id = ? limit 1', [
      teacher_id,
      subject_id,
    ]);
    if (rows2.length > 0) {
      return res.status(400).json({ message: 'Section already assigned to the teacher.' });
    }
    await db.query('INSERT INTO subjects SET ?', { teacher_id, subject_id, section_id });
    return res.status(201).json({
      success: true,
      message: 'Subject created successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/subjects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM teachers_subjects WHERE teacher_id = ? AND subject_id = ? limit 1', [
      id,
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    await db.query('DELETE FROM teachers_subjects WHERE teacher_id = ? AND subject_id = ?', [id, id]);
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
