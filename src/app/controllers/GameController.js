import Game from '../models/Game';
import Chess from '../../game_logic/chess';
import Board from '../models/Board';

class GameController {
  async newGame(req, res) {
    const game = await Game.create(req.body);
    const chess = new Chess();
    const board = await Board.create({
      game_id: game.id,
      board: JSON.stringify(chess.getBoard()),
      turn_player: '',
      move_number: 0,
    });
    return res.json({ game, board });
  }

  async loadGame(req, res) {
    // get last board state
    const board = await Board.findOne({
      where: { game_id: req.game.id },
      order: [['id', 'DESC']],
    });
    return res.json(board);
  }

  async legalMoves(req, res) {
    // get last board state
    const board = await Board.findOne({
      where: { game_id: req.game.id },
      order: [['id', 'DESC']],
    });
    const chess = new Chess(JSON.parse(board.board));
    const { position } = req.params;
    const square = chess.getBoard()[position];
    if (!square) {
      return res.status(400).json({ error: 'Invalid position!' });
    }
    return res.json(chess.getLegalMoves(square.color, square.piece, position));
  }

  async makeMove(req, res) {
    const { board } = req;
    const chess = new Chess(req.board);
    const { from, to } = req.params;
    const squareFrom = board[from];
    const squareTo = board[to];
    if (squareFrom && squareTo) {
      const moved = chess.move(squareFrom.color, from, to);
      if (moved) {
        const { move_number, turn_player } = req.boardModel;
        const newBoard = await Board.create({
          game_id: req.game.id,
          move_number: move_number + 1,
          turn_player: turn_player && turn_player === 'W' ? 'B' : 'W',
          board: JSON.stringify(chess.getBoard()),
        });
        return res.json(newBoard);
      }
      return res.status(400).json({ error: 'Invalid move!' });
    }

    return res.status(400).json({ error: 'Invalid position' });
  }
}

export default new GameController();
