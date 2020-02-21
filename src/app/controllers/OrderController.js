import * as Yup from 'yup';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Mail from '../../lib/mail';

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

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'street', 'number', 'cep'],
        },
      ],
    });

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Nova encomenda disponível para entrega.',
      template: 'deliverynotice',
      context: {
        deliveryman: order.deliveryman.name,
        product: order.product,
        recipient: order.recipient.name,
        address: order.recipient.street,
        number: order.recipient.number,
        cep: order.recipient.cep,
      },
    });

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

    await Order.destroy({ where: { id } });

    return res.json({ message: 'Registro de encomenda excluído.' });
  }
}

export default new OrderController();
