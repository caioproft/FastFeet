import * as Yup from 'yup';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().integer(),
      deliveryman_id: Yup.number().integer(),
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
}

export default new OrderController();
