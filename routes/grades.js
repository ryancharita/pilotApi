const express = require('express');
const db = require('../db/db');
const { validateBody } = require('../middlewares');
const { createGradeSchema } = require('../validation_schema');
const router = express.Router();

// GET All Grades
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT g.*, s.name AS student_name, sub.name AS subject_name, t.name AS teacher_name
       FROM grades g
       JOIN students st ON g.student_id = st.id
       JOIN users s ON st.user_id = s.id
       JOIN subjects sub ON g.subject_id = sub.id
       JOIN teachers tch ON g.teacher_id = tch.id
       JOIN users t ON tch.user_id = t.id`,
    );
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET Grade by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      `SELECT g.*, s.name AS student_name, sub.name AS subject_name, t.name AS teacher_name
       FROM grades g
       JOIN students st ON g.student_id = st.id
       JOIN users s ON st.user_id = s.id
       JOIN subjects sub ON g.subject_id = sub.id
       JOIN teachers tch ON g.teacher_id = tch.id
       JOIN users t ON tch.user_id = t.id
       WHERE g.id = $1`,
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Grade not found.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET Grades by Student
router.get('/by-student/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    const { rows } = await db.query(
      `SELECT g.*, s.name AS student_name, sub.name AS subject_name, t.name AS teacher_name
       FROM grades g
       JOIN students st ON g.student_id = st.id
       JOIN users s ON st.user_id = s.id
       JOIN subjects sub ON g.subject_id = sub.id
       JOIN teachers tch ON g.teacher_id = tch.id
       JOIN users t ON tch.user_id = t.id
       WHERE st.id = $1`,
      [student_id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Grades not found for this student.' });
    }
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET Grades by Teacher
router.get('/by-teacher/:teacher_id', async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const { rows } = await db.query(
      `SELECT g.*, s.name AS student_name, sub.name AS subject_name, t.name AS teacher_name
       FROM grades g
       JOIN students st ON g.student_id = st.id
       JOIN users s ON st.user_id = s.id
       JOIN subjects sub ON g.subject_id = sub.id
       JOIN teachers tch ON g.teacher_id = tch.id
       JOIN users t ON tch.user_id = t.id
       WHERE tch.id = $1`,
      [teacher_id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Grades not found for this teacher.' });
    }
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// CREATE Grade
router.post('/create', validateBody(createGradeSchema), async (req, res) => {
  try {
    const { student_id, subject_id, teacher_id, grade } = req.validatedBody;
    await db.query('INSERT INTO grades (student_id, subject_id, teacher_id, grade) VALUES ($1, $2, $3, $4)', [
      student_id,
      subject_id,
      teacher_id,
      grade,
    ]);
    return res.status(201).json({
      success: true,
      message: 'Grade created successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// UPDATE Grade
router.put('/update/:id', validateBody(createGradeSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id, subject_id, teacher_id, grade } = req.validatedBody;

    const { rows } = await db.query('SELECT * FROM grades WHERE id = $1 LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Grade not found.' });
    }

    await db.query(
      `UPDATE grades
       SET student_id = $1, subject_id = $2, teacher_id = $3, grade = $4
       WHERE id = $5`,
      [student_id, subject_id, teacher_id, grade, id],
    );

    return res.status(200).json({
      success: true,
      message: 'Grade updated successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE Grade
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await db.query('SELECT * FROM grades WHERE id = $1 LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Grade not found.' });
    }

    await db.query('DELETE FROM grades WHERE id = $1', [id]);

    return res.status(200).json({
      success: true,
      message: 'Grade deleted successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
