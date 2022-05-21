import {
  Coefficients,
  K_SIDE_CASTLE,
  lastFileWithColor,
  mailbox,
  mailbox64,
  mailboxOffsets,
  pieceCode,
  pieceCodeToMoveOffsets,
  Q_SIDE_CASTLE,
  secondRowsWithColor,
  WHITE,
} from "@/constants/chess.js";

export default class Move {
  piece = null;
  startIndex = 0;
  targetIndex = 0;
  capture = null;
  castling = 0;
  enPassant = false;
  enPassantCapture = false;
  promotion = null;
  score = 0;

  constructor({
    piece,
    targetIndex,
    capture = null,
    enPassant = false,
    enPassantCapture = false,
    castling = 0,
    promotion = null,
    chess,
  }) {
    this.piece = piece;
    this.startIndex = piece.index;
    this.targetIndex = targetIndex;
    this.capture = capture;
    this.enPassant = enPassant;
    this.enPassantCapture = enPassantCapture;
    this.castling = castling;
    this.promotion = promotion;
    this.setScore(chess);
  }

  get isCheck() {
    return this.capture && this.capture.type === pieceCode.king;
  }

  get startPosition() {
    return {
      y: parseInt(this.startIndex / 8),
      x: this.startIndex % 8,
    };
  }

  get targetPosition() {
    return {
      y: parseInt(this.targetIndex / 8),
      x: this.targetIndex % 8,
    };
  }

  get isTargetLastFile() {
    if (this.piece.color === WHITE) return this.targetPosition.y === 0;
    else return this.targetPosition.y === 7;
  }

  setScore(chess) {
    if (this.capture) this.score += Coefficients[this.capture.type];

    if (this.promotion) this.score += Coefficients[this.promotion];

    if (chess.inAttack(this.targetIndex, this.piece.color))
      this.score -= Coefficients[this.piece.type];
  }

  static generatePawnMoves(piece, chess, moves) {
    const validMoves = pieceCodeToMoveOffsets[piece.type][piece.color].map(
      (offset) => offset + piece.index
    );
    const secondRow = secondRowsWithColor[piece.color];

    const moveParams = {
      piece,
      targetIndex: validMoves[0],
      chess,
    };

    if (!this.isIndexValid(validMoves[0])) return [];

    if (!chess.getPiece(validMoves[0])) {
      if (parseInt(validMoves[0] / 8) === lastFileWithColor[piece.color]) {
        this.generatePromotionMoves(moves, moveParams);
      } else {
        moves.push(new Move(moveParams));
        if (piece.position.y === secondRow && !chess.getPiece(validMoves[1])) {
          moveParams.targetIndex = validMoves[1];
          moveParams.enPassant = true;
          moves.push(new Move(moveParams));
          moveParams.enPassant = false;
        }
      }
    }

    for (const offset of mailboxOffsets.p[piece.color]) {
      let index = piece.index;
      index = mailbox[mailbox64[index] + offset];
      if (index !== -1) {
        const enPassantCaptureIndex =
          offset < 0 ? chess.enPassantIndex - 8 : chess.enPassantIndex + 8;

        const capture = chess.getPiece(index);

        if (capture && capture.color != piece.color) {
          moveParams.targetIndex = capture.index;
          moveParams.capture = capture;
          if (parseInt(validMoves[0] / 8) === lastFileWithColor[piece.color]) {
            this.generatePromotionMoves(moves, moveParams, capture);
          } else {
            moves.push(new Move(moveParams));
          }
        } else if (index === enPassantCaptureIndex) {
          const enPassantPiece = chess.getPiece(chess.enPassantIndex);
          moveParams.capture = enPassantPiece;
          moveParams.targetIndex = enPassantCaptureIndex;
          moveParams.enPassantCapture = true;
          moves.push(new Move(moveParams));
        }
      }
    }
  }

  static generatePromotionMoves(moves, moveParams) {
    moveParams.promotion = "q";
    moves.push(new Move(moveParams));
    moveParams.promotion = "r";
    moves.push(new Move(moveParams));
    moveParams.promotion = "b";
    moves.push(new Move(moveParams));
    moveParams.promotion = "n";
    moves.push(new Move(moveParams));
    moveParams.promotion = null;
  }

  static generatePieceMoves(piece, chess, moves) {
    const offsets = mailboxOffsets[piece.type];
    const moveParams = {
      piece,
      capture: null,
      chess,
    };

    for (const offset of offsets) {
      /* for all knight or ray directions */
      let index = piece.index;
      index = mailbox[mailbox64[index] + offset];
      while (index != -1) {
        /* starting with from square */
        /* next square along the ray j */
        const sq = chess.getPiece(index);
        if (sq != null) {
          if (sq.color != piece.color) {
            moveParams.capture = sq;
            moveParams.targetIndex = index;
            moves.push(new Move(moveParams));
            moveParams.capture = null;
          } /* capture from i to n */
          break;
        }

        moveParams.targetIndex = index;
        moves.push(new Move(moveParams)); /* quiet move from i to n */

        if (!piece.isSlide) break; /* next direction */

        index = mailbox[mailbox64[index] + offset];
      }
    }

    // castling
    if (piece.type === pieceCode.king) {
      this.generateCastleMoves(piece, chess, moves);
    }
  }

  static generateCastleMoves(piece, chess, moves) {
    const moveParams = {
      piece,
      chess,
    };
    const index = piece.index;

    if (chess.castling[piece.color] & K_SIDE_CASTLE) {
      if (
        !chess.getPiece(index + 1) &&
        !chess.getPiece(index + 2) &&
        !chess.inCheck() &&
        !chess.inAttack(index + 1, piece.color) &&
        !chess.inAttack(index + 2, piece.color)
      ) {
        moveParams.castling = K_SIDE_CASTLE;
        moveParams.targetIndex = piece.index + 2;
        moves.push(new Move(moveParams));
      }
    }

    if (chess.castling[piece.color] & Q_SIDE_CASTLE) {
      if (
        !chess.getPiece(index - 1) &&
        !chess.getPiece(index - 2) &&
        !chess.getPiece(index - 3) &&
        !chess.inCheck() &&
        !chess.inAttack(index - 1, piece.color) &&
        !chess.inAttack(index - 2, piece.color) &&
        !chess.inAttack(index - 3, piece.color)
      ) {
        moveParams.castling = Q_SIDE_CASTLE;
        moveParams.targetIndex = piece.index - 2;
        moves.push(new Move(moveParams));
      }
    }
  }

  static isIndexValid(index) {
    return index >= 0 && index <= 64;
  }
}
