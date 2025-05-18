const z = require('zod');

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
const signupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['admin', 'teacher', 'student']),
});

const searchByEmailSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
});

const createTeacherSchema = z.object({
  teacher_id: z.string().min(3, 'Teacher ID must be at least 3 characters long'),
  user_id: z.number().positive('User ID must be a positive number'),
});

const createTeacherSubjectSchema = z.object({
  teacher_id: z.string().min(3, 'Teacher ID must be at least 3 characters long'),
  subject_idL: z.number().positive('Subject ID must be a positive number'),
  section_id: z.number().positive('Section ID must be a positive number'),
});

const createSubjectSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  code: z.string().min(3, 'Code must be at least 3 characters long'),
  description: z.string().min(3, 'Description must be at least 3 characters long'),
});

const createStudentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  student_id: z.string().min(3, 'Student ID must be at least 3 characters long'),
  user_id: z.number().positive('User ID must be a positive number'),
  grade_level_id: z.number().positive('Grade Level ID must be a positive number'),
  section_id: z.number().positive('Section ID must be a positive number'),
});

const createSectionSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  grade_level_id: z.number().positive('Grade Level ID must be a positive number'),
});

/**
 * Grade Schema
 *   id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    quarter1 DECIMAL(5,2),
    quarter2 DECIMAL(5,2),
    quarter3 DECIMAL(5,2),
    quarter4 DECIMAL(5,2),
    final_grade DECIMAL(5,2),
    remarks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 */
const createGradeSchema = z.object({
  student_id: z.number().positive('Student ID must be a positive number'),
  subject_id: z.number().positive('Subject ID must be a positive number'),
  teacher_id: z.number().positive('Teacher ID must be a positive number'),
  quarter1: z.number().positive('Quarter 1 must be a positive number'),
  quarter2: z.number().positive('Quarter 2 must be a positive number'),
  quarter3: z.number().positive('Quarter 3 must be a positive number'),
  quarter4: z.number().positive('Quarter 4 must be a positive number'),
  final_grade: z.number().positive('Final Grade must be a positive number'),
  remarks: z.string().min(3, 'Remarks must be at least 3 characters long'),
});

module.exports = {
  loginSchema,
  signupSchema,
  searchByEmailSchema,
  createTeacherSchema,
  createTeacherSubjectSchema,
  createSubjectSchema,
  createStudentSchema,
  createSectionSchema,
  createGradeSchema,
};
