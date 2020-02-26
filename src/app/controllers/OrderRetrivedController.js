import * as Yup from 'yup';
import {
  setHours,
  setMinutes,
  setSeconds,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';
import Order from '../models/Order';

class OrderRetrivedController {
  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'É preciso informar a data de retirada da encomenda.' });
    }

    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res
        .status(400)
        .json({ error: 'Não existe encomenda cadastrada com esse ID.' });
    }

    const { start_date } = req.body;

    const retrivedDate = parseISO(start_date);

    if (isBefore(retrivedDate, new Date())) {
      return res.status(400).json({
        error:
          'Não é possível retirar uma encomenda para entrega com data inferior à data atual.',
      });
    }
    const today = new Date();

    const startDay = setSeconds(setMinutes(setHours(today, 7), 59), 59);
    const endDay = setSeconds(setMinutes(setHours(today, 18), 0), 0);

    if (isBefore(retrivedDate, startDay) || isAfter(retrivedDate, endDay)) {
      return res.status(400).json({
        error:
          'Só é permitido retirar encomendas para entregas das 8:00 horas às 18:00 horas.',
      });
    }

    const count = await Order.findAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(retrivedDate), endOfDay(retrivedDate)],
        },
      },
    });

    if (count.length >= 5) {
      return res.status(401).json({
        error:
          'Só é permitido retirar 5 encomendas para entrega em um mesmo dia.',
      });
    }

    await order.update(req.body);

    const { id, product, recipient_id } = order;

    return res.json({ id, product, recipient_id, start_date });
  }
}

export default new OrderRetrivedController();
