export const KNIGHT = 'N';
export const PAWN = 'P';
export const KING = 'K';
export const BISHOP = 'B';
export const QUEEN = 'Q';
export const ROOK = 'R';

const WHITE = 'W';
const BLACK = 'B';
const valid_pieces = ['N', 'P', 'K', 'B', 'Q', 'R'];
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
export const PAWN_OFFSETS = {
  B: [16, 32, 17, 15],
  W: [-16, -32, -17, -15],
};
export const second_rank = { B: '7', W: '2' };
export const PIECE_OFFSETS = {
  N: [-18, -33, -31, -14, 18, 33, 31, 14],
  B: [-17, -15, 17, 15],
  R: [-16, 1, 16, -1],
  Q: [-17, -16, -15, 1, 17, 16, 15, -1],
  K: [-17, -16, -15, 1, 17, 16, 15, -1],
};
class Chess {
  constructor(board) {
    if (board) {
      this.board = board;
    } else {
      this.resetBoard();
    }
  }

  initialScore() {
    const pieces = {};
    pieces[PAWN] = 0;
    pieces[KNIGHT] = 0;
    pieces[BISHOP] = 0;
    pieces[ROOK] = 0;
    pieces[QUEEN] = 0;
    pieces[KING] = 0;
    const score = {};
    score[WHITE] = pieces;
    score[BLACK] = pieces;
    return score;
  }

  emptyBoard() {
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

  resetBoard() {
    this.emptyBoard();
    this.board.a8 = { color: BLACK, piece: ROOK };
    this.board.b8 = { color: BLACK, piece: KNIGHT };
    this.board.c8 = { color: BLACK, piece: BISHOP };
    this.board.d8 = { color: BLACK, piece: QUEEN };
    this.board.e8 = { color: BLACK, piece: KING };
    this.board.f8 = { color: BLACK, piece: BISHOP };
    this.board.g8 = { color: BLACK, piece: KNIGHT };
    this.board.h8 = { color: BLACK, piece: ROOK };

    this.board.a7 = { color: BLACK, piece: PAWN };
    this.board.b7 = { color: BLACK, piece: PAWN };
    this.board.c7 = { color: BLACK, piece: PAWN };
    this.board.d7 = { color: BLACK, piece: PAWN };
    this.board.e7 = { color: BLACK, piece: PAWN };
    this.board.f7 = { color: BLACK, piece: PAWN };
    this.board.g7 = { color: BLACK, piece: PAWN };
    this.board.h7 = { color: BLACK, piece: PAWN };

    this.board.a1 = { color: WHITE, piece: ROOK };
    this.board.b1 = { color: WHITE, piece: KNIGHT };
    this.board.c1 = { color: WHITE, piece: BISHOP };
    this.board.d1 = { color: WHITE, piece: QUEEN };
    this.board.e1 = { color: WHITE, piece: KING };
    this.board.f1 = { color: WHITE, piece: BISHOP };
    this.board.g1 = { color: WHITE, piece: KNIGHT };
    this.board.h1 = { color: WHITE, piece: ROOK };

    this.board.a2 = { color: WHITE, piece: PAWN };
    this.board.b2 = { color: WHITE, piece: PAWN };
    this.board.c2 = { color: WHITE, piece: PAWN };
    this.board.d2 = { color: WHITE, piece: PAWN };
    this.board.e2 = { color: WHITE, piece: PAWN };
    this.board.f2 = { color: WHITE, piece: PAWN };
    this.board.g2 = { color: WHITE, piece: PAWN };
    this.board.h2 = { color: WHITE, piece: PAWN };
  }

  getBoard() {
    return this.board;
  }

  setBoard(board) {
    this.board = board;
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

  getRank(position) {
    if (typeof position === 'string') {
      return position[1];
    }
    return this.valueToSAN(position)[1];
  }

  pawnCanDoubleJump(color, position) {
    if (typeof position === 'string') {
      position = SQUARES[position];
    }
    const rank = this.getRank(position);
    if (rank === second_rank[color]) {
      const offsets = PAWN_OFFSETS[color];

      const move = offsets[1] + position;
      let san = this.valueToSAN(move);
      const square = this.board[san];

      const front = offsets[0] + position;
      san = this.valueToSAN(front);
      const frontSquare = this.board[san];

      if (square && frontSquare) {
        if (!square.piece && !frontSquare.piece) {
          return true;
        }
      }
    }
    return false;
  }

  getLegalMoves(playerColor, piece, position) {
    const pos_value = this.isPositionInsideBoard(position);
    const legalMoves = [];
    if (pos_value !== null && valid_pieces.includes(piece)) {
      if (piece === PAWN) {
        const offsets = PAWN_OFFSETS[playerColor];
        const pawnPossibleMoves = [];
        // normal movement
        pawnPossibleMoves.push(offsets[0] + pos_value);

        // double jump
        if (this.pawnCanDoubleJump(playerColor, pos_value)) {
          pawnPossibleMoves.push(offsets[1] + pos_value);
        }

        for (let i = 0; i < pawnPossibleMoves.length; i++) {
          const move = pawnPossibleMoves[i];
          if (this.isPositionInsideBoard(move)) {
            const san = this.valueToSAN(move);
            const square = this.board[san];
            if (!square.piece) {
              legalMoves.push(san);
            }
          }
        }

        for (let i = 2; i < 4; i++) {
          const pawn_attack = offsets[i] + pos_value;
          if (this.isPositionInsideBoard(pawn_attack)) {
            const san = this.valueToSAN(pawn_attack);
            const square = this.board[san];
            if (square.piece && square.color !== playerColor) {
              legalMoves.push(san);
            }
          }
        }
      } else {
        const offsets = PIECE_OFFSETS[piece];
        for (let i = 0; i < offsets.length; i++) {
          let move = pos_value;
          while (true) {
            move += offsets[i];
            if (!this.isPositionInsideBoard(move)) {
              break;
            }
            const san = this.valueToSAN(move);
            const square = this.board[san];
            if (!square.piece) {
              legalMoves.push(san);
            } else {
              if (square.color === playerColor) {
                break;
              }
              legalMoves.push(san);
              break;
            }

            if (piece === KING || piece === KNIGHT) {
              break;
            }
          }
        }
      }
    }

    return legalMoves;
  }

  checkMove(playerColor, piece, from, to) {
    const legalMoves = this.getLegalMoves(playerColor, piece, from);
    return legalMoves.includes(to);
  }

  move(playerColor, from, to) {
    const square = this.board[from];
    if (square.color && square.color === playerColor) {
      if (this.checkMove(playerColor, square.piece, from, to)) {
        let flag = '-'; // normal movement
        if (this.board[to].color) {
          if (this.board[to].color !== playerColor) {
            flag = 'x'; // attack movement
          }
        }
        this.board[to] = { color: playerColor, piece: square.piece };
        this.board[from] = { color: '', piece: null };
        return flag;
      }
    }
    return null;
  }
}
export default Chess;
