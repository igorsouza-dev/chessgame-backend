import Sequelize, { Model } from 'sequelize';
import Game from './Game';

class Board extends Model {
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
        board: Sequelize.STRING,
        move_number: Sequelize.INTEGER,
        turn_player: Sequelize.STRING,
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

export default Board;
