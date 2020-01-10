import Chess from '../../game_logic/chess';
import Game from '../models/Game';
import Board from '../models/Board';

class MoveController {
  async store(req, res) {
    const game = await Game.findOne({
      where: { browser_id: req.browserId },
    });
    if (!game) {
      return res.status(400).json({ error: 'Game not found!' });
    }
    // get last board state
    const board = await Board.findOne({
      where: { game_id: game.id },
      order: [['id', 'DESC']],
    });
    const chess = new Chess(JSON.parse(board.board));
    const { player, from, to } = req.body;
    const moved = chess.move(player, from, to);
    if (moved) {
      const newBoard = await Board.create({
        game_id: game.id,
        board: JSON.parse(chess.getBoard()),
      });
      return res.json(newBoard);
    }
    return res.status(400).json({ error: 'Move is not possible' });
  }
}

export default new MoveController();
