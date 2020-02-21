import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import Recipient from '../models/Recipient';

class DeliverymanOrderController {
  async index(req, res) {
    const { page } = req.query;

    const checkDeliverymanExists = await Deliveryman.findByPk(req.params.id);

    if (!checkDeliverymanExists) {
      return res
        .status(400)
        .json({ error: 'Não há um entregador registrado com esse ID.' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        end_date: null,
        canceled_at: null,
      },
      limit: 10,
      offset: (page - 1) * 10,
      order: ['id'],
      attributes: ['id', 'recipient_id', 'product'],
      include: {
        model: Recipient,
        as: 'recipient',
        attributes: ['name'],
      },
    });

    if (orders.length === 0) {
      return res
        .status(400)
        .json({ error: 'Não existem encomendas para esse entregador.' });
    }

    return res.json(orders);
  }
}

export default new DeliverymanOrderController();
