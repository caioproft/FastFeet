import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import File from '../models/File';

class OrderDeliveredController {
  async index(req, res) {
    const checkDeliverymanExists = await Deliveryman.findByPk(req.params.id);

    if (!checkDeliverymanExists) {
      return res
        .status(400)
        .json({ error: 'Não existe um entregador cadastrado com esse ID.' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        end_date: {
          [Op.ne]: null,
        },
      },
      attributes: ['id', 'product'],
      order: [['end_date', 'DESC']],
      include: {
        model: Recipient,
        as: 'recipient',
        attributes: ['id', 'name', 'street', 'number', 'city', 'state', 'cep'],
      },
    });

    if (orders.length === 0) {
      return res.json({
        message: 'Você não possui nenhuma entrega concluída até o momento',
      });
    }

    return res.json(orders);
  }

  async update(req, res) {
    const { orderId } = req.params;

    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'É preciso fornecer a assinatura do destinatário.' });
    }

    const { originalname: name, filename: path } = req.file;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res
        .status(400)
        .json({ error: 'Não há uma encomenda registrada com esse ID.' });
    }

    const file = await File.create({ name, path });

    const { id } = file;

    if (order.start_date === null) {
      return res.status(400).json({
        error:
          'Não é possível finalizar uma entrega sem informar a data de início da entrega.',
      });
    }

    order.end_date = new Date();
    order.signature_id = id;

    await order.save();

    return res.json(order);
  }
}

export default new OrderDeliveredController();
