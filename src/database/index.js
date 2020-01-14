import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import Game from '../app/models/Game';
import Board from '../app/models/Board';
import Move from '../app/models/Move';

const models = [Game, Board, Move];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig[process.env.NODE_ENV]);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
