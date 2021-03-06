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
      },
    });
  }
}

export default new DeliveryNoticeMail();
