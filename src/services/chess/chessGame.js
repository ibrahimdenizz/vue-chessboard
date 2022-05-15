import {
  BLACK,
  DEFAULT_FEN,
  K_SIDE_CASTLE,
  pieceCode,
  pieceNameToCode,
  Q_SIDE_CASTLE,
  rookSides,
  WHITE,
  mailbox,
  mailbox64,
  mailboxOffsets,
  mailboxKingAttackOffsets,
} from "@/constants/chess.js";
import Board from "./board.js";
import Move from "./move.js";

export default class ChessGame {
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

  constructor(fen = DEFAULT_FEN) {
    this.board = new Board();
    this.fen = fen;
    this.buildMoves();
  }

  generatePseudoLegalMoves() {
    const pseudoMoves = [];
    for (const piece of this.board.squares) {
      if (piece && piece.color === this.currentPlayer) {
        if (piece.type === pieceCode.pawn)
          pseudoMoves.push(...Move.generatePawnMoves(piece, this));
        else pseudoMoves.push(...Move.generatePieceMoves(piece, this));
      }
    }
    return pseudoMoves;
  }

  getLegalMoves() {
    const pseudoMoves = this.generatePseudoLegalMoves();
    const currentPlayer = this.currentPlayer;
    for (const pseudoMove of pseudoMoves) {
      this._makeMove(pseudoMove);
      if (!this.inCheck(currentPlayer)) {
        this.moves.push(pseudoMove);
      }
      this.undoMove();
    }
  }

  buildMoves() {
    this.moves = [];
    this.getLegalMoves();
  }

  checkDoubleCheck() {
    const offsets = mailboxOffsets.k;
    let captureCount = 0;
    for (const offset of offsets) {
      let index = this.board.kings[this.currentPlayer].index;
      index = mailbox[mailbox64[index] + offset];
      while (index != -1) {
        const sq = this.getPiece(index);
        if (sq != null) {
          const captureOffsets = mailboxOffsets[sq.type];
          if (
            sq.isSlide &&
            sq.color != this.currentPlayer &&
            captureOffsets.includes(offset)
          ) {
            captureCount++;
          }
          break;
        }

        index = mailbox[mailbox64[index] + offset];
      }
      if (captureCount == 2) {
        this.moves = this.moves.filter(
          (move) => move.piece.type === pieceCode.king
        );
        break;
      }
    }
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
      if (piece.index === rookSides[piece.color].k)
        this.castling[piece.color] &= Q_SIDE_CASTLE;
      else if (piece.index === rookSides[piece.color].q)
        this.castling[piece.color] &= K_SIDE_CASTLE;
    }
  }

  generateHistory(move) {
    this.history.push({
      move: move,
      castling: {
        [WHITE]: this.castling[WHITE],
        [BLACK]: this.castling[BLACK],
      },
      enPassantIndex: this.enPassantIndex,
      halfMoveCount: this.halfMoveCount,
      moveCount: this.moveCount,
      currentPlayer: this.currentPlayer,
    });
  }

  _makeMove(move) {
    this.generateHistory(move);

    this.board.squares[move.startIndex] = null;
    this.enPassantIndex = move.enPassant ? move.targetIndex : null;
    if (this.currentPlayer === BLACK) this.moveCount++;
    this.currentPlayer = this.opponentColor;

    this.checkCastlingBeforeMove(move);
    if (move.capture) {
      this.board.squares[move.capture.index] = null;
    }

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
  }

  makeMove(move) {
    this._makeMove(move);
    this.buildMoves();
  }

  undoMove() {
    if (this.history.length > 0) {
      const old = this.history.pop();

      const move = old.move;
      const capture = move.capture;
      const piece = move.piece;

      this.castling = old.castling;
      this.enPassantIndex = old.enPassantIndex;
      this.halfMoveCount = old.halfMoveCount;
      this.moveCount = old.moveCount;
      this.currentPlayer = old.currentPlayer;

      piece.index = move.startIndex;
      this.board.squares[move.startIndex] = piece;
      this.board.squares[move.targetIndex] = null;

      if (move.capture) {
        this.board.squares[capture.index] = capture;
      }

      if (move.castling) {
        let rookStartIndex, rookEndIndex;

        if (move.castling & K_SIDE_CASTLE) {
          rookStartIndex = rookSides[piece.color].k;
          rookEndIndex = rookStartIndex - 2;
        } else if (move.castling & Q_SIDE_CASTLE) {
          rookStartIndex = rookSides[piece.color].q;
          rookEndIndex = rookStartIndex + 3;
        }

        const rook = this.getPiece(rookEndIndex);
        rook.index = rookStartIndex;

        this.board.squares[rookEndIndex] = null;
        this.board.squares[rookStartIndex] = rook;
      }
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

  loadGameWithFen(fen) {
    this.fen = fen;
    this.buildMoves();
  }

  inKnightAttack(_index, color) {
    for (const knightOffset of mailboxKingAttackOffsets.n) {
      let index = _index;
      index = mailbox[mailbox64[index] + knightOffset];
      const sq = this.getPiece(index);
      if (sq && sq.type === pieceCode.knight && sq.color !== color) {
        return true;
      }
    }
    return false;
  }

  inPawnAttack(_index, color) {
    const opponentColor = this.getOpponentColor(color);

    for (const pawnOffset of mailboxKingAttackOffsets.p[opponentColor]) {
      let index = _index;
      index = mailbox[mailbox64[index] + pawnOffset];
      const sq = this.getPiece(index);
      if (sq && sq.type === pieceCode.pawn && sq.color !== color) {
        return true;
      }
    }

    return false;
  }

  inKingAttack(_index, color) {
    for (const kingOffset of mailboxKingAttackOffsets.k) {
      let index = _index;
      index = mailbox[mailbox64[index] + kingOffset];
      const sq = this.getPiece(index);
      if (sq && sq.type === pieceCode.king && sq.color !== color) {
        return true;
      }
    }

    return false;
  }

  inSlidingAttack(_index, color) {
    const offsets = mailboxOffsets.k;

    for (const offset of offsets) {
      let index = _index;
      index = mailbox[mailbox64[index] + offset];
      while (index != -1) {
        const sq = this.getPiece(index);
        if (sq != null) {
          let captureOffsets = mailboxOffsets[sq.type];

          if (
            sq.isSlide &&
            sq.color !== color &&
            captureOffsets.includes(offset)
          )
            return true;

          break;
        }

        index = mailbox[mailbox64[index] + offset];
      }
    }

    return false;
  }

  inAttack(index, color) {
    return (
      this.inKnightAttack(index, color) ||
      this.inPawnAttack(index, color) ||
      this.inSlidingAttack(index, color) ||
      this.inKingAttack(index, color)
    );
  }

  inCheck(color = this.currentPlayer) {
    return this.inAttack(this.board.kings[color].index, color);
  }

  perft(depth) {
    let totalMove = 0;
    let captures = 0;
    const moves = this.generatePseudoLegalMoves();
    for (const move of moves) {
      this._makeMove(move);
      if (!this.inCheck()) {
        if (depth - 1 > 0) {
          const perft = this.perft(depth - 1);
          totalMove += perft.count;
          captures += perft.captures;
        } else totalMove++;
      }
      this.undoMove();
    }

    return { count: totalMove, captures };
  }

  getOpponentColor(color) {
    return color === WHITE ? BLACK : WHITE;
  }

  get opponentColor() {
    return this.currentPlayer === WHITE ? BLACK : WHITE;
  }

  get gameOver() {
    return (
      (this.inCheck() && !this.moves.length) || this.board.pieceCount === 2
    );
  }

  get winner() {
    if (this.gameOver) {
      if (this.inCheck()) {
        return this.currentPlayer === WHITE ? BLACK : WHITE;
      } else {
        return "draw";
      }
    } else {
      return null;
    }
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
    this.castling[WHITE] = 0;
    this.castling[BLACK] = 0;

    if (value !== "-")
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
      const num = 8 - parseInt(this.enPassantIndex / 8);
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

  get copy() {
    const copyGame = new ChessGame(this.fen);
    copyGame.history = this.history.slice();
    return copyGame;
  }
}
