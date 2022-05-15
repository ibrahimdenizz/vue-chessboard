import {
  K_SIDE_CASTLE,
  mailbox,
  mailbox64,
  mailboxOffsets,
  pieceCode,
  Q_SIDE_CASTLE,
  secondRowsWithColor,
  WHITE,
} from "@/constants/chess";

export default class Move {
  piece = null;
  startIndex = 0;
  targetIndex = 0;
  capture = null;
  castling = 0;
  enPassant = false;

  constructor({
    piece,
    targetIndex,
    capture = null,
    enPassant = false,
    castling = 0,
  }) {
    this.piece = piece;
    this.startIndex = piece.index;
    this.targetIndex = targetIndex;
    this.capture = capture;
    this.enPassant = enPassant;
    this.castling = castling;
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

  static generatePawnMoves(piece, chess) {
    const validMoves = piece.moveOffsets.map((offset) => offset + piece.index);
    const secondRow = secondRowsWithColor[piece.color];
    const returnMoves = [];

    const moveParams = {
      piece,
      targetIndex: validMoves[0],
    };

    if (!this.isIndexValid(validMoves[0])) return [];

    if (!chess.getPiece(validMoves[0])) {
      returnMoves.push(new Move(moveParams));

      if (piece.position.y === secondRow && !chess.getPiece(validMoves[1])) {
        moveParams.targetIndex = validMoves[1];
        moveParams.enPassant = true;
        returnMoves.push(new Move(moveParams));
        moveParams.enPassant = false;
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
          returnMoves.push(new Move(moveParams));
        } else if (index === enPassantCaptureIndex) {
          const enPassantPiece = chess.getPiece(chess.enPassantIndex);
          moveParams.capture = enPassantPiece;
          moveParams.targetIndex = enPassantCaptureIndex;
          returnMoves.push(new Move(moveParams));
        }
      }
    }

    return returnMoves;
  }

  static generatePieceMoves(piece, chess) {
    const returnMoves = [];
    const offsets = mailboxOffsets[piece.type];
    const moveParams = {
      piece,
      capture: null,
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
            returnMoves.push(new Move(moveParams));
            moveParams.capture = null;
          } /* capture from i to n */
          break;
        }

        moveParams.targetIndex = index;
        returnMoves.push(new Move(moveParams)); /* quiet move from i to n */

        if (!piece.isSlide) break; /* next direction */

        index = mailbox[mailbox64[index] + offset];
      }
    }

    // castling
    if (piece.type === pieceCode.king) {
      returnMoves.push(...this.generateCastleMoves(piece, chess));
    }

    return returnMoves;
  }

  static generateCastleMoves(piece, chess) {
    const returnMoves = [];
    const moveParams = {
      piece,
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
        returnMoves.push(new Move(moveParams));
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
        returnMoves.push(new Move(moveParams));
      }
    }

    return returnMoves;
  }

  static isIndexValid(index) {
    return index >= 0 && index <= 64;
  }
}
