import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/mail';

class DeliveryNoticeMail {
  get key() {
    return 'DeliveryNoticeMail';
  }

  async handle({ data }) {
    const { order } = data;
    console.log('Fila executada...');
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
        date: format(
          parseISO(order.created_at, "'Dia' dd 'de' 'MMM', às 'H:mm'h ", {
            locale: pt,
          })
        ),
      },
    });
  }
}

export default new DeliveryNoticeMail();
