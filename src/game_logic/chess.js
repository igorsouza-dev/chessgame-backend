export const KNIGHT = 'N';

// prettier-ignore
export const SQUARES = {
  a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
  a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
  a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
  a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
  a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
  a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
  a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
  a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
};
export const PIECE_OFFSETS = {
  N: [-18, -33, -31, -14, 18, 33, 31, 14],
};
class Chess {
  constructor(board) {
    if (board) {
      this.board = board;
    } else {
      this.resetBoard();
    }
  }

  resetBoard() {
    const squares = Object.keys(SQUARES);
    this.board = {};
    squares.map(square => {
      this.board[square] = {
        color: '',
        piece: null,
      };
      return square;
    });
  }

  isPositionInsideBoard(position) {
    if (typeof position === 'string') {
      position = SQUARES[`${position}`.toLowerCase()];
      if (position === undefined) {
        return null;
      }
    }
    const last_pos = SQUARES.h1;
    const first_pos = SQUARES.a8;
    if (
      position >= first_pos &&
      position <= last_pos &&
      (position & 0x88) === 0
    ) {
      return position;
    }
    return null;
  }

  valueToSAN(value) {
    const swaped = Object.fromEntries(
      Object.entries(SQUARES).map(a => a.reverse())
    );
    return swaped[value];
  }

  getLegalMoves(piece, position) {
    const pos_value = this.isPositionInsideBoard(position);
    const offsets = PIECE_OFFSETS[piece];
    const legalMoves = [];
    if (pos_value && offsets) {
      for (let i = 0; i < offsets.length; i++) {
        const move = offsets[i] + pos_value;
        if (this.isPositionInsideBoard(move))
          legalMoves.push(this.valueToSAN(move));
      }
    }
    return legalMoves;
  }

  checkMove(piece, from, to) {
    const legalMoves = this.getLegalMoves(piece, from);
    return legalMoves.includes(to);
  }

  getBoard() {
    return this.board;
  }
}
export default Chess;
