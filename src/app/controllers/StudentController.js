import * as Yup from 'yup';

import Student from '../models/Student';
import File from '../models/File';

class StudentController {
  async store(req, res) {
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
  }

  async update(req, res) {
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

    if (req.student.email !== req.body.email) {
      const emailExists = await Student.findOne({
        where: { email: req.body.email },
      });

      if (emailExists) {
        return res.status(400).json({ error: 'E-mail already exists.' });
      }
    }

    await req.student.update(req.body);

    return res.json(req.student);
  }

  async delete(req, res) {
    await req.student.destroy();
    return res.status(204).json();
  }

  async index(req, res) {
    const { page = 1, size = 20 } = req.query;

    const students = await Student.findAll({
      limit: size,
      offset: (page - 1) * size,
      attributes: ['name', 'email', 'birth_date', 'weight', 'height', 'age'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(students);
  }
}

export default new StudentController();
