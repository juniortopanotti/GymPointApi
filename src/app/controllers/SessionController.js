import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validations fails.' });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res
          .status(401)
          .json({ error: `User with email ${email} not exists.` });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Password doest not match.' });
      }

      const { id, name } = user;

      return res.json({
        user: {
          id,
          name,
          email,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'An error occured while processing request.' });
    }
  }
}

export default new SessionController();
