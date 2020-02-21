import * as Yup from 'yup';
import OrderProblem from '../models/OrderProblem';
import Order from '../models/Order';

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

    const { order_id } = orderProblem;

    const order = await Order.findByPk(order_id);

    order.canceled_at = new Date();

    await order.save();

    return res.json(orderProblem);
  }
}

export default new OrderProblemController();
