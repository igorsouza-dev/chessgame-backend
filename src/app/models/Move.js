import Sequelize, { Model } from 'sequelize';
import Game from './Game';

class Move extends Model {
  static init(sequelize) {
    super.init(
      {
        game_id: {
          type: Sequelize.INTEGER,
          references: {
            model: Game,
            key: 'id',
          },
        },
        move_number: Sequelize.INTEGER,
        player: Sequelize.STRING,
        from: Sequelize.STRING,
        to: Sequelize.STRING,
        piece: Sequelize.STRING,
        flag: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Game, {
      foreignKey: 'game_id',
    });
  }
}

export default Move;
