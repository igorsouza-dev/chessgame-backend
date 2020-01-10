import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class Game extends Model {
  static init(sequelize) {
    super.init(
      {
        browser_id: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async game => {
      if (!game.browser_id) {
        game.browser_id = await bcrypt.hash(new Date().getTime().toString(), 8);
      }
    });
    return this;
  }
}

export default Game;
