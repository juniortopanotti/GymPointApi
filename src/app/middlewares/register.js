import Register from '../models/Register';

export default async (req, res, next) => {
  const { id } = req.params;

  const register = await Register.findByPk(id);

  if (!register) {
    return res
      .status(400)
      .json({ error: 'Register with informed id not exists.' });
  }

  req.register = register;

  return next();
};
