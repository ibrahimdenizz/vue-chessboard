import {
  BLACK,
  DEFAULT_FEN,
  K_SIDE_CASTLE,
  pieceCode,
  pieceNameToCode,
  Q_SIDE_CASTLE,
  rookSides,
  WHITE,
} from "@/constants/chess";
import Board from "./board";
import Move from "./move";

class Chess {
  board = new Board();
  currentPlayer = WHITE;
  castling = {
    [WHITE]: 0,
    [BLACK]: 0,
  };
  enPassantIndex = null;
  halfMoveCount = 0;
  moveCount = 1;
  moves = [];

  constructor() {
    this.fen = DEFAULT_FEN;
  }

  buildMoves() {
    this.moves = [];
    this.board.squares
      .filter((piece) => piece && piece.color === this.currentPlayer)
      .forEach((piece) => {
        if (piece.code.toLowerCase() === pieceCode.pawn)
          this.generatePawnMoves(piece);
        else this.generatePieceMoves(piece);
      });
  }

  generatePawnMoves(piece) {
    const moves = Move.generatePawnMoves(piece, this);
    this.moves.push(...moves);
  }

  generatePieceMoves(piece) {
    const moves = Move.generatePieceMoves(piece, this);
    this.moves.push(...moves);
  }

  getPiece(x, y = null) {
    return this.board.getPiece(x, y);
  }

  getPieceMoves(piece) {
    return this.moves.filter((move) => move.piece.equals(piece));
  }

  checkCastlingBeforeMove(move) {
    const piece = move.piece;
    if (piece.type === pieceCode.king) this.castling[piece.color] = 0;
    else if (piece.type === pieceCode.rook) {
      console.log(piece.index, rookSides[piece.color].q);
      if (piece.index === rookSides[piece.color].k)
        this.castling[piece.color] &= Q_SIDE_CASTLE;
      else if (piece.index === rookSides[piece.color].q)
        this.castling[piece.color] &= K_SIDE_CASTLE;
    }
  }

  makeMove(move) {
    this.board.squares[move.startIndex] = null;
    this.enPassantIndex = move.enPassant ? move.targetIndex : null;
    if (this.currentPlayer === BLACK) this.moveCount++;
    this.currentPlayer = this.currentPlayer === WHITE ? BLACK : WHITE;

    this.checkCastlingBeforeMove(move);

    if (move.piece.type === pieceCode.pawn) {
      this.makePawnMove(move);
    } else if (move.castling) {
      this.makeCastlingMove(move);
    } else {
      const piece = move.piece;
      piece.index = move.targetIndex;
      this.board.squares[move.targetIndex] = piece;
    }

    if (move.piece.type === pieceCode.pawn || move.capture)
      this.halfMoveCount = 0;
    else this.halfMoveCount++;

    this.buildMoves();
  }

  makeCastlingMove(move) {
    const piece = move.piece;
    if (move.castling & K_SIDE_CASTLE) {
      this.board.squares[piece.index + 2] = piece;
      const rook = this.getPiece(rookSides[piece.color].k);
      this.board.squares[rook.index] = null;
      this.board.squares[rook.index - 2] = rook;
      rook.index -= 2;
      piece.index += 2;
    } else if (move.castling & Q_SIDE_CASTLE) {
      this.board.squares[piece.index - 2] = piece;
      const rook = this.getPiece(rookSides[piece.color].q);
      this.board.squares[rook.index] = null;
      this.board.squares[rook.index + 3] = rook;
      rook.index += 3;
      piece.index -= 2;
    }

    this.castling[piece.color] = 0;
  }

  makePawnMove(move) {
    const piece = move.piece;
    piece.index = move.targetIndex;

    if (move.isTargetLastFile) {
      // Update pawn as queen when it is in last square
      piece.changePieceType(pieceNameToCode[piece.color]["queen"]);
    }
    this.board.squares[move.targetIndex] = piece;
  }

  set enPassant(value) {
    if (value === "-") {
      this.enPassantIndex = null;
    } else {
      const [char, num] = value.split("");
      this.enPassantIndex = (parseInt(num) - 1) * 8 + (char.charCodeAt(0) - 97);
    }
  }

  set castlingStr(value) {
    for (const char of value.split("")) {
      switch (char) {
        case "K":
          this.castling[WHITE] |= K_SIDE_CASTLE;
          break;
        case "Q":
          this.castling[WHITE] |= Q_SIDE_CASTLE;
          break;
        case "k":
          this.castling[BLACK] |= K_SIDE_CASTLE;
          break;
        case "q":
          this.castling[BLACK] |= Q_SIDE_CASTLE;
          break;
      }
    }
  }

  // FEN
  get fenTurn() {
    return this.currentPlayer === WHITE ? "w" : "b";
  }

  get fenCastling() {
    let str = "";
    str += this.castling[WHITE] & K_SIDE_CASTLE ? "K" : "";
    str += this.castling[WHITE] & Q_SIDE_CASTLE ? "Q" : "";
    str += this.castling[BLACK] & K_SIDE_CASTLE ? "k" : "";
    str += this.castling[BLACK] & Q_SIDE_CASTLE ? "q" : "";
    return str ? str : "-";
  }

  get fenEnPassant() {
    console.log(this.enPassantIndex);
    if (this.enPassantIndex === null) return "-";
    else {
      const char = (this.enPassantIndex % 8) + 97;
      const num = parseInt(this.enPassantIndex / 8) + 1;
      return `${String.fromCharCode(char)}${num}`;
    }
  }

  set fen(fen) {
    console.log(fen);
    const split_fen = fen.split(" ");
    this.board.fenPosition = split_fen[0];
    this.currentPlayer = split_fen[1] === "w" ? WHITE : BLACK;
    this.castlingStr = split_fen[2];
    this.enPassant = split_fen[3];
    this.halfMoveCount = parseInt(split_fen[4]);
    this.moveCount = parseInt(split_fen[5]);
    this.buildMoves();
  }

  get fen() {
    return `${this.board.fenPosition} ${this.fenTurn} ${this.fenCastling} ${this.fenEnPassant} ${this.halfMoveCount} ${this.moveCount}`;
  }
}

export default {
  install: (app) => {
    // Plugin code goes here
    app.config.globalProperties.$game = new Chess();
  },
};
