import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string()
          .email()
          .required(),
        birth_date: Yup.date().required(),
        weight: Yup.number()
          .positive()
          .required(),
        height: Yup.number()
          .positive()
          .required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails.' });
      }

      const emailExists = await Student.findOne({
        where: { email: req.body.email },
      });

      if (emailExists) {
        return res.status(400).json({ error: 'E-mail already exists.' });
      }

      const student = await Student.create(req.body);
      return res.json(student);
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'An error occurred while processing request.' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string()
          .email()
          .required(),
        birth_date: Yup.date().required(),
        weight: Yup.number()
          .positive()
          .required(),
        height: Yup.number()
          .positive()
          .required(),
      });

      let student = await Student.findByPk(id);

      if (!student) {
        return res
          .status(400)
          .json({ error: 'Student with the id entered was not found.' });
      }

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails.' });
      }

      if (student.email !== req.body.email) {
        const emailExists = await Student.findOne({
          where: { email: req.body.email },
        });

        if (emailExists) {
          return res.status(400).json({ error: 'E-mail already exists.' });
        }
      }

      student = await student.update(req.body);

      return res.json(student);
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'An error occurred while processing request.' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const student = await Student.findByPk(id);

      if (!student) {
        return res
          .status(400)
          .json({ error: 'Student with the id entered was not found.' });
      }

      await student.destroy();

      return res.status(204).json();
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'An error occurred while processing request.' });
    }
  }

  async index(req, res) {
    const { page = 1, size = 20 } = req.query;

    const students = await Student.findAll({
      limit: size,
      offset: (page - 1) * size,
      attributes: ['name', 'email', 'birth_date', 'weight', 'height', 'age'],
    });

    return res.json(students);
  }
}

export default new StudentController();
