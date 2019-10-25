import HelpOrder from '../models/HelpOrder';

export default async (req, res, next) => {
  const { id } = req.params;

  const helpOrder = await HelpOrder.findByPk(id);

  if (!helpOrder) {
    return res.status(400).json({
      error: 'Help order with the id entered was not found.',
    });
  }

  req.helpOrder = helpOrder;

  return next();
};
