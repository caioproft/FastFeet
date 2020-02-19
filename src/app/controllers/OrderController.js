import * as Yup from 'yup';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'É preciso informar todos os campos.' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const checkRecipientExists = await Recipient.findByPk(recipient_id);

    if (!checkRecipientExists) {
      return res
        .status(400)
        .json({ error: 'Não existe um destinatário cadastrado com esse ID.' });
    }

    const checkDeliverymanExists = await Deliveryman.findByPk(deliveryman_id);

    if (!checkDeliverymanExists) {
      return res
        .status(400)
        .json({ error: 'Não existe um entregador cadastrado com esse ID.' });
    }

    const { id, product } = await Order.create(req.body);

    return res.json({ id, recipient_id, deliveryman_id, product });
  }

  async index(req, res) {
    const { page } = req.query;

    const orders = await Order.findAll({
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'signature',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      signature_id: Yup.number(),
      product: Yup.string(),
      canceled_at: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'É preciso informar o destinatário, entregador e produto.',
      });
    }

    const { id } = req.params;
    const { recipient_id, deliveryman_id } = req.body;
    const order = await Order.findByPk(id);

    if (!order) {
      return res
        .status(400)
        .json({ error: 'Não há encomenda cadastrada com esse ID.' });
    }

    if (recipient_id && recipient_id !== order.recipient_id) {
      const checkRecipientExists = await Recipient.findByPk(recipient_id);

      if (!checkRecipientExists) {
        return res.status(400).json({
          error: 'Não existe um destinatário cadastrado com esse ID.',
        });
      }
    }

    if (deliveryman_id && deliveryman_id !== order.deliveryman_id) {
      const checkDeliverymanExists = await Deliveryman.findByPk(deliveryman_id);

      if (!checkDeliverymanExists) {
        return res
          .status(400)
          .json({ error: 'Não existe um entregador cadastrado com esse ID.' });
      }
    }

    await order.update(req.body);

    return res.json(order);
  }

  async delete(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res
        .status(400)
        .json({ error: 'Não existe encomenda cadastrada com esse ID.' });
    }

    order.canceled_at = new Date();

    await order.save();

    return res.json(order);
  }
}

export default new OrderController();
