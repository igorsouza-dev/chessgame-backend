import Game from '../models/Game';
import Board from '../models/Board';

class BoardController {
  async store(req, res) {
    const response = await Game.findOne({
      where: { browser_id: req.browserId },
    });
    if (!response.data) {
      return res.status(400).json({ error: 'Game not found!' });
    }
    const game = response.data;
    const board = await Board.create({
      game_id: game.id,
      board: req.body.board,
    });

    return res.json(board);
  }

  async index(req, res) {
    const boards = await Board.findAll();
    return res.json(boards);
  }
}

export default new BoardController();
