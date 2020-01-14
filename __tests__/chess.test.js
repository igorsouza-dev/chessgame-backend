import Chess, {
  SQUARES,
  PIECE_OFFSETS,
  PAWN_OFFSETS,
} from '../src/game_logic/chess';

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
  test('It should have a setBoard function that accepts a object as parameter', () => {
    expect(chess.setBoard).toBeInstanceOf(Function);
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
    expect(PAWN_OFFSETS).toBeTruthy();
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
    expect(chess.isPositionInsideBoard('a8')).toStrictEqual(0);
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
    const playerColor = 'W';
    let correct_moves = ['d4', 'e5', 'g5', 'h4', 'h2', 'g1', 'e1', 'd2'];
    chess.emptyBoard();
    expect(chess.getLegalMoves(playerColor, 'N', 'f3')).toEqual(correct_moves);

    correct_moves = ['e5', 'f6', 'h6', 'h2', 'f2', 'e3'];
    expect(chess.getLegalMoves(playerColor, 'N', 'g4')).toEqual(correct_moves);
  });
  test('Function getRank should return 2 when position a2', () => {
    expect(chess.getRank('a2')).toEqual('2');
    // even when passing the integer position
    expect(chess.getRank(96)).toEqual('2');
  });
  test('Function pawnCanDoubleJump should return true when position a2 for the white pawn', () => {
    chess.emptyBoard();
    const board = chess.getBoard();
    board.b2.piece = 'P';
    board.b2.color = 'W';
    chess.setBoard(board);
    expect(chess.pawnCanDoubleJump('W', 'b2')).toEqual(true);
  });
  test('Function getLegalMoves should return the correct array of moves for the Pawn', () => {
    const playerColor = 'W';
    const enemyColor = 'B';
    chess.emptyBoard();
    // normal movement
    let correct_moves = ['b4'];
    expect(chess.getLegalMoves(playerColor, 'P', 'b3')).toEqual(correct_moves);

    chess.emptyBoard();
    // pawn movement with enemy in front of him
    const board = chess.getBoard();
    board.b4.color = enemyColor;
    board.b4.piece = 'P';
    correct_moves = [];
    expect(chess.getLegalMoves(playerColor, 'P', 'b3')).toEqual(correct_moves);

    // pawn can attack
    board.c4.color = enemyColor;
    board.c4.piece = 'P';
    board.a4.color = enemyColor;
    board.a4.piece = 'P';
    correct_moves = ['a4', 'c4'];
    expect(chess.getLegalMoves(playerColor, 'P', 'b3')).toEqual(correct_moves);
    // pawn should not be able to attack his own pieces
    board.a4.color = playerColor;
    board.a4.piece = 'P';
    correct_moves = ['c4'];
    expect(chess.getLegalMoves(playerColor, 'P', 'b3')).toEqual(correct_moves);
  });
  test('Function getLegalMoves should allow Pawn double jump when second rank', () => {
    const playerColor = 'W';
    chess.emptyBoard();
    // normal movement
    const correct_moves = ['b3', 'b4'];
    expect(chess.getLegalMoves(playerColor, 'P', 'b2')).toEqual(correct_moves);
  });
  test('Function getLegalMoves should return the correct array of moves for the King', () => {
    const playerColor = 'W';
    chess.emptyBoard();
    // normal movement
    let correct_moves = ['a3', 'b3', 'c3', 'c2', 'c1', 'b1', 'a1', 'a2'];
    expect(chess.getLegalMoves(playerColor, 'K', 'b2')).toEqual(correct_moves);
    // attacking one pawn and having one friendly pawn around
    correct_moves = ['a3', 'c3', 'c2', 'c1', 'b1', 'a1', 'a2'];
    const board = chess.getBoard();
    board.b3.piece = 'P';
    board.b3.color = 'W';
    board.c3.piece = 'P';
    board.c3.color = 'B';
    chess.setBoard(board);
    expect(chess.getLegalMoves(playerColor, 'K', 'b2')).toEqual(correct_moves);
  });
  test('Function getLegalMoves should return the correct array of moves for the Bishop', () => {
    const playerColor = 'W';
    chess.emptyBoard();
    // normal movement
    let correct_moves = ['a3', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8', 'c1', 'a1'];
    expect(chess.getLegalMoves(playerColor, 'B', 'b2')).toEqual(correct_moves);
    // friendly pawn blocking the path
    const board = chess.getBoard();
    board.d4.piece = 'P';
    board.d4.color = 'W';
    correct_moves = ['a3', 'c3', 'c1', 'a1'];
    chess.setBoard(board);
    expect(chess.getLegalMoves(playerColor, 'B', 'b2')).toEqual(correct_moves);
    // enemy pawn blocking the path
    board.d4.color = 'B';
    correct_moves = ['a3', 'c3', 'd4', 'c1', 'a1'];
    chess.setBoard(board);
    expect(chess.getLegalMoves(playerColor, 'B', 'b2')).toEqual(correct_moves);
  });
  test('Function getLegalMoves should return the correct array of moves for the Queen', () => {
    const playerColor = 'W';
    chess.emptyBoard();
    // normal movement
    // prettier-ignore
    let correct_moves = [
      'a3', 'b3', 'b4',
      'b5', 'b6', 'b7', 'b8',
      'c3', 'd4', 'e5', 'f6',
      'g7', 'h8', 'c2', 'd2',
      'e2', 'f2', 'g2', 'h2',
      'c1', 'b1', 'a1', 'a2'
    ];
    expect(chess.getLegalMoves(playerColor, 'Q', 'b2')).toEqual(correct_moves);
    const board = chess.getBoard();
    // friendly pawn blocks the path
    board.d4.piece = 'P';
    board.d4.color = playerColor;
    // prettier-ignore
    correct_moves = [
      'a3', 'b3', 'b4',
      'b5', 'b6', 'b7', 'b8',
      'c3', 'c2', 'd2',
      'e2', 'f2', 'g2', 'h2',
      'c1', 'b1', 'a1', 'a2'
    ];
    chess.setBoard(board);
    expect(chess.getLegalMoves(playerColor, 'Q', 'b2')).toEqual(correct_moves);
    // enemy pawn blocks the path
    board.d4.color = 'B';
    // prettier-ignore
    correct_moves = [
      'a3', 'b3', 'b4',
      'b5', 'b6', 'b7', 'b8',
      'c3', 'd4', 'c2', 'd2',
      'e2', 'f2', 'g2', 'h2',
      'c1', 'b1', 'a1', 'a2'
    ];
    chess.setBoard(board);
    expect(chess.getLegalMoves(playerColor, 'Q', 'b2')).toEqual(correct_moves);
  });
  test('Function getLegalMoves should return the correct array of moves for the Rook', () => {
    chess.emptyBoard();
    const playerColor = 'W';
    // normal movement
    // prettier-ignore
    let correct_moves = [
      'b3', 'b4', 'b5', 'b6',
      'b7', 'b8', 'c2', 'd2',
      'e2', 'f2', 'g2', 'h2',
      'b1', 'a2'
    ];
    expect(chess.getLegalMoves(playerColor, 'R', 'b2')).toEqual(correct_moves);
    // prettier-ignore
    correct_moves = [
      'b8', 'c8', 'd8', 'e8',
      'f8', 'g8', 'h8', 'a7',
      'a6', 'a5', 'a4', 'a3',
      'a2', 'a1'
    ];
    expect(chess.getLegalMoves(playerColor, 'R', 'a8')).toEqual(correct_moves);
  });
  test('Function getLegalMoves should return the correct array of moves', () => {
    chess.emptyBoard();
    const correct_moves = ['f6', 'h6', 'h2', 'f2', 'e3'];
    const playerColor = 'W';
    const board = chess.getBoard();
    board.e5.color = playerColor;
    board.e5.piece = 'P';
    chess.setBoard(board);
    expect(chess.getLegalMoves(playerColor, 'N', 'g4')).toEqual(correct_moves);
  });
  test('Function checkMove should exists', () => {
    expect(chess.checkMove).toBeInstanceOf(Function);
  });
  test('Function checkMove should return true or false depending on the position intended, current position and piece', () => {
    const playerColor = 'W';
    expect(chess.checkMove(playerColor, 'N', 'g4', 'f4')).toStrictEqual(false);
    expect(chess.checkMove(playerColor, 'N', 'g4', 'e5')).toStrictEqual(true);
    expect(chess.checkMove(playerColor, 'aaa', 'g4', 'e5')).toStrictEqual(
      false
    );
  });
  test('Function checkMove should consider the player color when checking if can move', () => {
    const playerColor = 'W';
    let board = chess.getBoard();
    board.e5.color = 'B';
    board.e5.piece = 'K';
    chess.setBoard(board);
    expect(chess.checkMove(playerColor, 'N', 'g4', 'e5')).toStrictEqual(true);
    chess.resetBoard();
    board = chess.getBoard();
    board.e5.color = playerColor;
    board.e5.piece = 'P';
    chess.setBoard(board);
    expect(chess.checkMove(playerColor, 'N', 'g4', 'e5')).toStrictEqual(false);
  });
  test('Function move should exists', () => {
    expect(chess.move).toBeInstanceOf(Function);
  });
  test('Function move should be able to change the board correctly', () => {
    const player1 = 'W';
    const player2 = 'B';
    let board = chess.getBoard();
    board.g4 = { color: player1, piece: 'N' };
    board.e5 = { color: player2, piece: 'P' };
    chess.setBoard(board);
    chess.move(player1, 'g4', 'e5');
    board = chess.getBoard();
    expect(board.e5).toEqual({ color: player1, piece: 'N' });
    expect(board.g4).toEqual({ color: '', piece: null });
    // checks when target square is the same color
    board.g4 = { color: player1, piece: 'N' };
    expect(chess.move(player1, 'e5', 'g4')).toStrictEqual(null);

    // empty target square
    board.g4 = { color: '', piece: '' };
    expect(chess.move(player1, 'e5', 'g4')).toStrictEqual('-');

    // checks if player is the owner of the piece
    expect(chess.move(player2, 'e5', 'g4')).toStrictEqual(null);
  });
  test('Function move should return the flag x when the movement was an attack', () => {
    const player1 = 'W';
    const player2 = 'B';
    const board = chess.getBoard();
    board.g4 = { color: player1, piece: 'N' };
    board.e5 = { color: player2, piece: 'P' };
    chess.setBoard(board);
    const moved = chess.move(player1, 'g4', 'e5');
    expect(moved).toStrictEqual('x');
  });
});
