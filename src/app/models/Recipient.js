import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.INTEGER,
        complement: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        cep: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}

export default Recipient;
