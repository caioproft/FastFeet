import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number()
        .required()
        .positive()
        .integer(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Informe todos os campos obrigatórios.' });
    }

    const { name } = req.body;

    const recipientExists = await Recipient.findOne({ where: { name } });

    if (recipientExists) {
      return res
        .status(400)
        .json({ error: 'Já existe cadastro para este destinatário.' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json({ recipient });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number()
        .integer()
        .positive(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      cep: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'O número do endereço não pode ser negativo.' });
    }

    const { id } = req.params;
    const { name } = req.body;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res
        .status(400)
        .json({ error: 'Não existe um destinatário com esse id.' });
    }

    if (name && name !== recipient.name) {
      const recipientExists = await Recipient.findOne({ where: { name } });

      if (recipientExists) {
        return res.status(401).json({
          error: 'Já existe um destinatário cadastrado com esse nome.',
        });
      }
    }

    const { street, number, state, city, cep } = await recipient.update(
      req.body
    );

    return res.json({ name, street, number, state, city, cep });
  }
}

export default new RecipientController();
