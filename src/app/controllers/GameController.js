import Game from '../models/Game';

class GameController {
  async store(req, res) {
    const game = await Game.create(req.body);
    return res.json(game);
  }

  async index(req, res) {
    const games = await Game.findAll();
    return res.json(games);
  }
}

export default new GameController();
