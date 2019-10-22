import Student from '../models/Student';

export default async (req, res, next) => {
  const { id } = req.params;

  const student = await Student.findByPk(id);

  if (!student) {
    return res
      .status(400)
      .json({ error: 'Student with the id entered was not found.' });
  }

  req.student = student;

  return next();
};
