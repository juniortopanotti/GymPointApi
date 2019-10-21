import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number()
        .positive()
        .required(),
      duration: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation failed.',
      });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async index(req, res) {
    const { page = 1, size = 20 } = req.query;

    const plans = await Plan.findAll({
      limit: size,
      offset: (page - 1) * size,
      attributes: ['title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number()
        .positive()
        .required(),
      duration: Yup.number()
        .positive()
        .required(),
    });

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(400).json({
        error: 'Plan with informed id not exists.',
      });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation failed.',
      });
    }

    await plan.update(req.body);

    return res.json(plan);
  }

  async delete(req, res) {
    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(400).json({
        error: 'Plan with informed id not exists.',
      });
    }

    await plan.destroy();

    return res.status(204).json();
  }
}

export default new PlanController();
