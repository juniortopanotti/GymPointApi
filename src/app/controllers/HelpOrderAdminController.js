import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';

class HelpOrderAdminController {
  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation failed.',
      });
    }

    const { userId } = req;

    const { helpOrder } = req;

    const updatedHelpOrder = await helpOrder.update({
      answer: req.body.answer,
      answer_by: userId,
      answer_at: new Date(),
    });

    const student = await Student.findByPk(helpOrder.student_id);

    const mailObject = {
      student,
      question: helpOrder.question,
      answer: req.body.answer,
    };

    await Queue.add(AnswerMail.key, mailObject);

    return res.json(updatedHelpOrder);
  }

  async index(req, res) {
    const { page = 1, size = 1 } = req.query;

    const helpOrders = await HelpOrder.findAll({
      limit: size,
      offset: (page - 1) * size,
      where: {
        answer_at: null,
      },
      order: [['createdAt', 'ASC']],
      attributes: ['id', 'question', 'createdAt'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(helpOrders);
  }
}

export default new HelpOrderAdminController();
