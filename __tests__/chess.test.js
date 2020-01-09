import Chess, { SQUARES, PIECE_OFFSETS } from '../src/game_logic/chess';

describe('Chess ', () => {
  let chess;
  beforeEach(() => {
    chess = new Chess();
  });
  test('Main file should exists', () => {
    expect(chess).toBeTruthy();
  });
  test('Array of mapped board squares should exists', () => {
    expect(SQUARES).toBeTruthy();
  });
  test('It should have a function named resetBoard', () => {
    expect(chess.resetBoard).toBeInstanceOf(Function);
  });
  test('It should have a function named getBoard that returns the current state of the board as an object', () => {
    expect(chess.getBoard()).toBeInstanceOf(Object);
  });
  test('The constructor should accept a board object set it as the current board', () => {
    const squares = Object.keys(SQUARES);
    const board = {};
    squares.map(square => {
      board[square] = {
        color: '',
        piece: null,
      };
      return square;
    });
    board.a8.piece = 'K';
    board.a8.color = 'W';
    const newChess = new Chess(board);

    expect(newChess.getBoard()).toEqual(board);
  });
  test('Array of mapped board squares should be correctly mapped', () => {
    // prettier-ignore
    const squares = {
      a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
      a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
      a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
      a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
      a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
      a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
      a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
      a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
    };
    expect(SQUARES).toEqual(squares);
  });
  test('Array of pieces movesets should exists ', () => {
    expect(PIECE_OFFSETS).toBeTruthy();
  });
  test('Array of possible moves for the Knight should be correctly mapped', () => {
    const possible_moves = [-18, -33, -31, -14, 18, 33, 31, 14];
    expect(PIECE_OFFSETS.N).toEqual(possible_moves);
  });
  test('Function isPositionInsideBoard should exists', () => {
    expect(chess.isPositionInsideBoard).toBeInstanceOf(Function);
  });
  test('Function isPositionInsideBoard should return the position value or null depending on the position passed', () => {
    expect(chess.isPositionInsideBoard('a88')).toStrictEqual(null);
    expect(chess.isPositionInsideBoard('a1')).toStrictEqual(112);
    expect(chess.isPositionInsideBoard(200)).toStrictEqual(null);
    expect(chess.isPositionInsideBoard(-1)).toStrictEqual(null);
    expect(chess.isPositionInsideBoard(2)).toStrictEqual(2);
  });
  test('Function valueToSAN should exists', () => {
    expect(chess.valueToSAN).toBeInstanceOf(Function);
  });
  test('Function valuToSAN should convert integer values to SAN strings', () => {
    expect(chess.valueToSAN(0)).toEqual('a8');
    expect(chess.valueToSAN(119)).toEqual('h1');
    expect(chess.valueToSAN(66)).toEqual('c4');
  });
  test('Function getLegalMoves should exists', () => {
    expect(chess.getLegalMoves).toBeInstanceOf(Function);
  });
  test('Function getLegalMoves should return an empty array if passed invalid piece or position', () => {
    expect(chess.getLegalMoves('xx', 'f3')).toEqual([]);
    expect(chess.getLegalMoves('N', 'f55')).toEqual([]);
  });
  test('Function getLegalMoves should return an array of moves for the Knight', () => {
    let correct_moves = ['d4', 'e5', 'g5', 'h4', 'h2', 'g1', 'e1', 'd2'];
    expect(chess.getLegalMoves('N', 'f3')).toEqual(correct_moves);
    correct_moves = ['e5', 'f6', 'h6', 'h2', 'f2', 'e3'];
    expect(chess.getLegalMoves('N', 'g4')).toEqual(correct_moves);
  });
  test('Function checkMove should exists', () => {
    expect(chess.checkMove).toBeInstanceOf(Function);
  });
  test('Function checkMove should return true or false depending on the position intended, current position and piece', () => {
    expect(chess.checkMove('N', 'g4', 'f4')).toStrictEqual(false);
    expect(chess.checkMove('N', 'g4', 'e5')).toStrictEqual(true);
    expect(chess.checkMove('aaa', 'g4', 'e5')).toStrictEqual(false);
  });
});
