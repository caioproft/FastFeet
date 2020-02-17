import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'É preciso informar nome e e-mail para cadastro.' });
    }

    const { email } = req.body;

    const deliverymanExists = await Deliveryman.findOne({ where: { email } });

    if (deliverymanExists) {
      return res
        .status(400)
        .json({ error: 'Já existe um usuário cadastrado com esse e-mail.' });
    }

    const { id, name } = await Deliveryman.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'É preciso informal nome e e-mail do entregador.' });
    }

    const { id } = req.params;
    const { email } = req.body;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res
        .status(400)
        .json({ error: 'Não existe um entregador cadastrado com este ID.' });
    }

    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { email },
      });

      if (deliverymanExists) {
        return res.status(400).json({
          error: 'Já existe um entregador cadastrado com esse e-mail.',
        });
      }
    }

    const { name, avatar_id } = await deliveryman.update(req.body);

    return res.json({ id, name, email, avatar_id });
  }

  async index(req, res) {
    const { page } = req.query;

    const deliverymans = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      order: ['name'],
      limit: 20,
      offset: (page - 1) * 20,
      include: {
        model: File,
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      },
    });

    if (deliverymans.length === 0) {
      return res.json({
        message: 'Não existem entregadores cadastrados até o momento.',
      });
    }

    return res.json(deliverymans);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliverymans = await Deliveryman.findByPk(id);

    if (!deliverymans) {
      return res
        .status(400)
        .json({ error: 'Não há entregador cadastrado com esse ID.' });
    }

    Deliveryman.destroy({ where: { id } });
    return res.json({ message: 'Entregador excluído com sucesso!' });
  }
}

export default new DeliverymanController();
