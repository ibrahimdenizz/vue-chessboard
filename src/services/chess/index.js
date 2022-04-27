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
  history = [];

  constructor(fen) {
    this.fen = fen || DEFAULT_FEN;
    this.buildMoves();
  }

  generatePseudoLegalMoves() {
    const pseudoMoves = [];
    this.board.squares
      .filter((piece) => piece && piece.color === this.currentPlayer)
      .forEach((piece) => {
        if (piece.code.toLowerCase() === pieceCode.pawn)
          pseudoMoves.push(...Move.generatePawnMoves(piece, this));
        else pseudoMoves.push(...Move.generatePieceMoves(piece, this));
      });
    return pseudoMoves;
  }

  getLegalMoves() {
    const pseudoMoves = this.generatePseudoLegalMoves();
    for (const pseudoMove of pseudoMoves) {
      this._makeMove(pseudoMove);
      const opponentMoves = this.generatePseudoLegalMoves();
      if (!opponentMoves.find((move) => move.isCheck)) {
        this.moves.push(pseudoMove);
      }
      this.undoMove();
    }
    console.log(pseudoMoves, this.moves, this.board.squares, this.history);
  }

  buildMoves() {
    this.moves = [];
    this.getLegalMoves();
  }

  checkKingCheck() {
    //const kingCaptureMoves = this.moves.filter(
    //  (move) => move.capture && move.capture.type === pieceCode.king
    //);
    //  const kingCapturePiece = kingCaptureMoves.map((x) => x.piece);
  }

  getPiece(x, y = null) {
    return this.board.getPiece(x, y);
  }

  getPieceMoves(piece) {
    console.log(
      piece,
      this.moves.filter((move) => move.piece.equals(piece))
    );
    return this.moves.filter((move) => move.piece.equals(piece));
  }

  checkCastlingBeforeMove(move) {
    const piece = move.piece;
    if (piece.type === pieceCode.king) this.castling[piece.color] = 0;
    else if (piece.type === pieceCode.rook) {
      if (piece.index === rookSides[piece.color].k)
        this.castling[piece.color] &= Q_SIDE_CASTLE;
      else if (piece.index === rookSides[piece.color].q)
        this.castling[piece.color] &= K_SIDE_CASTLE;
    }
  }

  _makeMove(move) {
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
      const piece = move.piece.copy;
      piece.index = move.targetIndex;
      this.board.squares[move.targetIndex] = piece;
    }

    if (move.piece.type === pieceCode.pawn || move.capture)
      this.halfMoveCount = 0;
    else this.halfMoveCount++;

    this.history.push(this.fen);
  }

  makeMove(move) {
    this._makeMove(move);
    this.buildMoves();
  }

  undoMove() {
    if (this.history.length > 1) {
      this.history.pop();
      this.fen = this.history[this.history.length - 1];
    }
  }

  makeCastlingMove(move) {
    const piece = move.piece.copy;

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
    const piece = move.piece.copy;
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
    if (this.enPassantIndex === null) return "-";
    else {
      const char = (this.enPassantIndex % 8) + 97;
      const num = parseInt(this.enPassantIndex / 8) + 1;
      return `${String.fromCharCode(char)}${num}`;
    }
  }

  set fen(fen) {
    const split_fen = fen.split(" ");
    this.board.fenPosition = split_fen[0];
    this.currentPlayer = split_fen[1] === "w" ? WHITE : BLACK;
    this.castlingStr = split_fen[2];
    this.enPassant = split_fen[3];
    this.halfMoveCount = parseInt(split_fen[4]);
    this.moveCount = parseInt(split_fen[5]);
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
