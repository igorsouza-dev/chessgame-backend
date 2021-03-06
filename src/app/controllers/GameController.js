import Game from '../models/Game';
import Chess from '../../game_logic/chess';
import Board from '../models/Board';
import Move from '../models/Move';

class GameController {
  async newGame(req, res) {
    const game = await Game.create(req.body);
    const chess = new Chess();

    const board = await Board.create({
      game_id: game.id,
      board: JSON.stringify(chess.getBoard()),
      score: JSON.stringify(chess.initialScore()),
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
    const moves = await Move.findAll({
      where: { game_id: req.game.id },
      order: [['id', 'DESC']],
    });
    return res.json({ board, moves });
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
        const { move_number, turn_player, score } = req.boardModel;
        const scoreObj = JSON.parse(score);
        if (moved === 'x') {
          scoreObj[squareFrom.color][squareTo.piece] += 1;
        }
        const newBoard = await Board.create({
          game_id: req.game.id,
          move_number: move_number + 1,
          turn_player: turn_player && turn_player === 'W' ? 'B' : 'W',
          score: JSON.stringify(scoreObj),
          board: JSON.stringify(chess.getBoard()),
        });
        const move = await Move.create({
          game_id: req.game.id,
          player: newBoard.turn_player,
          flag: moved,
          move_number: newBoard.move_number,
          from,
          to,
          piece: squareFrom.piece,
        });
        return res.json({ board: newBoard, move });
      }
      return res.status(400).json({ error: 'Invalid move!' });
    }

    return res.status(400).json({ error: 'Invalid position' });
  }
}

export default new GameController();
