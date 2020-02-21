import * as Yup from 'yup';
import OrderProblem from '../models/OrderProblem';
import Order from '../models/Order';
import Mail from '../../lib/mail';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class OrderProblemController {
  async index(req, res) {
    const { page } = req.query;

    const ordersProblems = await OrderProblem.findAll({
      attributes: ['id', 'order_id', 'description'],
      limit: 20,
      offset: (page - 1) * 20,
      include: {
        model: Order,
        as: 'order',
        attributes: ['product'],
      },
    });

    if (ordersProblems.length === 0) {
      return res.json({
        message: 'Atualmente não existem encomendas com problemas.',
      });
    }

    return res.json(ordersProblems);
  }

  async show(req, res) {
    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res
        .status(400)
        .json({ error: 'Não existe encomenda cadastrada com esse ID.' });
    }

    const orderProblems = await OrderProblem.findAll({
      where: {
        order_id: req.params.orderId,
      },
      attributes: ['id', 'description'],
    });

    if (orderProblems.length === 0) {
      return res.status(400).json({
        error: 'Não existem problemas relacionados à esta encomenda.',
      });
    }

    return res.json(orderProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error:
          'É preciso fornecer uma descrição para o problema enfrentado com a entrega ou encomenda.',
      });
    }

    const { orderId } = req.params;

    const checkOrderExists = await Order.findByPk(orderId);

    if (!checkOrderExists) {
      return res
        .status(400)
        .json({ error: 'Não existe uma encomenda cadastrada com esse ID.' });
    }

    const { id, description } = await OrderProblem.create(req.body);

    const orderProblem = await OrderProblem.findByPk(id);

    orderProblem.order_id = orderId;

    orderProblem.save();

    return res.json({ id, orderId, description });
  }

  async delete(req, res) {
    const { problemId } = req.params;

    const orderProblem = await OrderProblem.findByPk(problemId, {
      attributes: ['id', 'description', 'order_id'],
    });

    if (!orderProblem) {
      return res
        .status(400)
        .json({ error: 'Não há problema cadastrado com esse ID.' });
    }

    const { order_id } = orderProblem;

    const order = await Order.findByPk(order_id, {
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

    order.canceled_at = new Date();

    await order.save();

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Entrega de encomenda cancelada.',
      template: 'ordercancellation',
      context: {
        deliveryman: order.deliveryman.name,
        product: order.product,
        recipient: order.recipient.name,
        address: order.recipient.street,
        number: order.recipient.number,
        cep: order.recipient.cep,
      },
    });

    return res.json(orderProblem);
  }
}

export default new OrderProblemController();
