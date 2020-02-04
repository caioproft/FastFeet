import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'É preciso informar todos os campos para cadastrar-se.',
      });
    }

    try {
      const { email } = req.body;

      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res
          .status(400)
          .json({ error: 'Já existe um usuário cadastrado com esse e-mail.' });
      }
    } catch (error) {
      return console.log('Erro', error);
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({ id, name, email });
  }
}

export default new UserController();
