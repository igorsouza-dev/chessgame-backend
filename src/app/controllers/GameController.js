import Game from '../models/Game';
import Chess from '../../game_logic/chess';
import Board from '../models/Board';

class GameController {
  async store(req, res) {
    const game = await Game.create(req.body);
    if (game) {
      const chess = new Chess();
      const board = await Board.create({
        game_id: game.id,
        board: JSON.stringify(chess.getBoard()),
      });
      return res.json({ game, board });
    }
    return res.json({ game });
  }

  async index(req, res) {
    const games = await Game.findAll(
      {
        where: { browser_id: req.browserId },
      },
      {
        include: [
          {
            model: Board,
          },
        ],
      }
    );
    return res.json(games);
  }
}

export default new GameController();
