import * as Yup from 'yup';
import {
  isBefore,
  addMonths,
  parseISO,
  setHours,
  setSeconds,
  setMinutes,
  setMilliseconds,
} from 'date-fns';
import { Op } from 'sequelize';

import Plan from '../models/Plan';
import Student from '../models/Student';
import Register from '../models/Register';

class RegisterController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .required(),
      plan_id: Yup.number()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation failed.',
      });
    }

    const { start_date, plan_id, student_id } = req.body;

    const parsedDate = setHours(
      setMinutes(setSeconds(setMilliseconds(parseISO(start_date), 0), 0), 0),
      0
    );

    const currentDate = setHours(
      setMinutes(setSeconds(setMilliseconds(parseISO(new Date()), 0), 0), 0),
      0
    );

    if (isBefore(parsedDate, currentDate)) {
      return res.status(400).json({ error: 'Past date are not permitted' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res
        .status(400)
        .json({ error: 'Plan with informed id not exists.' });
    }

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res
        .status(400)
        .json({ error: 'Student with informed id not exists.' });
    }

    const { duration, price } = plan;

    const endDate = addMonths(parsedDate, duration);

    const register = await Register.findOne({
      where: {
        student_id,
        canceled_at: null,
        end_date: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (register) {
      return res
        .status(400)
        .json({ error: 'There are one plan active for this student.' });
    }

    const registerPrice = price * duration;

    const registerSaved = await Register.create({
      student_id,
      plan_id,
      start_date,
      end_date: endDate,
      price: registerPrice,
    });

    return res.json(registerSaved);
  }

  async index(req, res) {
    const { page = 1, size = 20 } = req.query;

    const registers = await Register.findAll({
      limite: size,
      offset: (page - 1) * size,
      attributes: ['id', 'start_date', 'end_date', 'price', 'expired'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(registers);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation failed.',
      });
    }

    const { start_date, plan_id } = req.body;

    const parsedDate = setHours(
      setMinutes(setSeconds(setMilliseconds(parseISO(start_date), 0), 0), 0),
      0
    );

    const currentDate = setHours(
      setMinutes(setSeconds(setMilliseconds(parseISO(new Date()), 0), 0), 0),
      0
    );

    if (isBefore(parsedDate, currentDate)) {
      return res.status(400).json({ error: 'Past date are not permitted' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res
        .status(400)
        .json({ error: 'Plan with informed id not exists.' });
    }

    const { price, duration } = plan;

    const endDate = addMonths(parsedDate, duration);

    const registerPrice = price * duration;

    await req.register.update({
      canceled_at: null,
      end_date: endDate,
      price: registerPrice,
      start_date,
      plan_id,
    });

    return res.json(req.register);
  }

  /*
   *  Mais interessante a matricula ser cancelada para continuar com o
   *  registro no sistema a fim de manter um histórico.
   */
  async delete(req, res) {
    if (req.register.canceled_at) {
      return res.status(400).json({
        error: 'Register already canceled.',
      });
    }

    await req.register.update({ canceled_at: new Date() });

    return res.json(req.register);
  }
}

export default new RegisterController();
