import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import User from '../models/User';

class HelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(500).json({
        error: 'Validation failed.',
      });
    }

    const { id } = req.student;
    const { question } = req.body;

    const helpOrder = await HelpOrder.create({
      student_id: id,
      question,
    });

    return res.json(helpOrder);
  }

  async index(req, res) {
    const { page = 1, size = 20 } = req.query;

    const { id } = req.student;

    const helpOrders = await HelpOrder.findAll({
      limit: size,
      offset: (page - 1) * size,
      where: {
        student_id: id,
      },
      attributes: ['id', 'question', 'answer', 'answer_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'answerBy',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(helpOrders);
  }
}

export default new HelpOrderController();
