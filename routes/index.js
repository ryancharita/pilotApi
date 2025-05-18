const express = require('express');
const auth = require('./auth');
const user = require('./user');
const teachers = require('./teachers');
const subjects = require('./subjects');
const students = require('./student');
const sections = require('./section');
const gradeLevels = require('./gradeLevel');
const grades = require('./grades');
const { authenticateToken } = require('../middlewares/auth');
const router = express.Router();

router.use('/auth', auth);
router.use('/user', authenticateToken, user);
router.use('/teachers', authenticateToken, teachers);
router.use('/subjects', authenticateToken, subjects);
router.use('/students', authenticateToken, students);
router.use('/sections', authenticateToken, sections);
router.use('/grade_levels', authenticateToken, gradeLevels);
router.use('/grades', authenticateToken, grades);

module.exports = router;
