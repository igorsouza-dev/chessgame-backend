import Chess from '../../game_logic/chess';
import Board from '../models/Board';

export default async (req, res, next) => {
  const board = await Board.findOne({
    where: { game_id: req.game.id },
    order: [['id', 'DESC']],
  });
  const chess = new Chess(JSON.parse(board.board));
  req.board = chess.getBoard();
  req.boardModel = board;
  return next();
};
