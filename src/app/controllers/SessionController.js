import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'É preciso informar e-mail e senha.' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(400)
        .json({ error: 'Usuário não cadastrado no sistema' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Senha inválida' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, 'cc3945408173f14a4c4844d5f0c7a0b4', {
        expiresIn: '7d',
      }),
    });
  }
}

export default new SessionController();
