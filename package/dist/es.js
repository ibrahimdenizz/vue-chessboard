import { openBlock, createElementBlock, createStaticVNode, createElementVNode, resolveComponent, createBlock, createCommentVNode, Fragment, renderList, normalizeClass, createVNode, normalizeStyle, toDisplayString } from "vue";
const DEFAULT_FEN$1 = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", WHITE$1 = "white", BLACK$1 = "black";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", WHITE = "white", BLACK = "black", K_SIDE_CASTLE = 2, Q_SIDE_CASTLE = 1;
const RANKS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const rookSides = {
  black: { k: 7, q: 0 },
  white: {
    k: 63,
    q: 56
  }
};
const secondRowsWithColor = {
  [WHITE]: 6,
  [BLACK]: 1
};
const lastFileWithColor = {
  [WHITE]: 0,
  [BLACK]: 7
};
const pieceTypeToCode = {
  black: {
    k: "k",
    q: "q",
    b: "b",
    n: "n",
    p: "p",
    r: "r"
  },
  white: {
    k: "K",
    q: "Q",
    b: "B",
    n: "N",
    p: "P",
    r: "R"
  }
};
const pieceCode = {
  king: "k",
  queen: "q",
  bishop: "b",
  knight: "n",
  pawn: "p",
  rook: "r"
};
const pieceCodeToName = {
  k: "king",
  q: "queen",
  b: "bishop",
  n: "knight",
  p: "pawn",
  r: "rook"
};
const pieceCodeToMoveOffsets = {
  k: [1, 7, -8, 9, 1, -7, -8, -9],
  q: [1, 7, -8, 9, 1, -7, -8, -9],
  b: [7, 9, -7, -9],
  n: [6, 10, 15, 17, -6, -10, -15, -17],
  p: { [WHITE]: [-8, -16], [BLACK]: [8, 16] },
  r: [1, 8, -1, -8]
};
const mailbox = [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  -1,
  -1,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  -1,
  -1,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  -1,
  -1,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  -1,
  -1,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  -1,
  -1,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  -1,
  -1,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  -1,
  -1,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
];
const mailbox64 = [
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  61,
  62,
  63,
  64,
  65,
  66,
  67,
  68,
  71,
  72,
  73,
  74,
  75,
  76,
  77,
  78,
  81,
  82,
  83,
  84,
  85,
  86,
  87,
  88,
  91,
  92,
  93,
  94,
  95,
  96,
  97,
  98
];
const mailboxOffsets = {
  n: [-21, -19, -12, -8, 8, 12, 19, 21],
  b: [-11, -9, 9, 11],
  r: [-10, -1, 1, 10],
  q: [-11, -10, -9, -1, 1, 9, 10, 11],
  k: [-11, -10, -9, -1, 1, 9, 10, 11],
  p: {
    [WHITE]: [-11, -9],
    [BLACK]: [9, 11]
  }
};
const mailboxKingAttackOffsets = {
  k: [-11, -10, -9, -1, 1, 9, 10, 11],
  n: [-21, -19, -12, -8, 8, 12, 19, 21],
  p: {
    [WHITE]: [11, 9],
    [BLACK]: [-9, -11]
  }
};
const TT_EXACT = 0, TT_UPPER = 1, TT_LOWER = 2;
const Coefficients = {
  k: 2e4,
  q: 900,
  r: 500,
  b: 330,
  n: 320,
  p: 100,
  P_ISSUES: 0.5,
  LEGAL_MOVES: 0.1,
  [WHITE]: 1,
  [BLACK]: -1
};
const endGameValue = Coefficients.r * 2 + Coefficients.b + Coefficients.n;
const PAWN_SQ = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  50,
  50,
  50,
  50,
  50,
  50,
  50,
  50,
  10,
  10,
  20,
  30,
  30,
  20,
  10,
  10,
  5,
  5,
  10,
  25,
  25,
  10,
  5,
  5,
  0,
  0,
  0,
  20,
  20,
  0,
  0,
  0,
  5,
  -5,
  -10,
  0,
  0,
  -10,
  -5,
  5,
  5,
  10,
  10,
  -20,
  -20,
  10,
  10,
  5,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
];
const KNIGHTS_SQ = [
  -50,
  -40,
  -30,
  -30,
  -30,
  -30,
  -40,
  -50,
  -40,
  -20,
  0,
  0,
  0,
  0,
  -20,
  -40,
  -30,
  0,
  10,
  15,
  15,
  10,
  0,
  -30,
  -30,
  5,
  15,
  20,
  20,
  15,
  5,
  -30,
  -30,
  0,
  15,
  20,
  20,
  15,
  0,
  -30,
  -30,
  5,
  10,
  15,
  15,
  10,
  5,
  -30,
  -40,
  -20,
  0,
  5,
  5,
  0,
  -20,
  -40,
  -50,
  -40,
  -30,
  -30,
  -30,
  -30,
  -40,
  -50
];
const BISHOP_SQ = [
  -20,
  -10,
  -10,
  -10,
  -10,
  -10,
  -10,
  -20,
  -10,
  0,
  0,
  0,
  0,
  0,
  0,
  -10,
  -10,
  0,
  5,
  10,
  10,
  5,
  0,
  -10,
  -10,
  5,
  5,
  10,
  10,
  5,
  5,
  -10,
  -10,
  0,
  10,
  10,
  10,
  10,
  0,
  -10,
  -10,
  10,
  10,
  10,
  10,
  10,
  10,
  -10,
  -10,
  5,
  0,
  0,
  0,
  0,
  5,
  -10,
  -20,
  -10,
  -10,
  -10,
  -10,
  -10,
  -10,
  -20
];
const ROOK_SQ = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  5,
  10,
  10,
  10,
  10,
  10,
  10,
  5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  0,
  0,
  0,
  5,
  5,
  0,
  0,
  0
];
const QUEEN_SQ = [
  -20,
  -10,
  -10,
  -5,
  -5,
  -10,
  -10,
  -20,
  -10,
  0,
  0,
  0,
  0,
  0,
  0,
  -10,
  -10,
  0,
  5,
  5,
  5,
  5,
  0,
  -10,
  -5,
  0,
  5,
  5,
  5,
  5,
  0,
  -5,
  0,
  0,
  5,
  5,
  5,
  5,
  0,
  -5,
  -10,
  5,
  5,
  5,
  5,
  5,
  0,
  -10,
  -10,
  0,
  5,
  0,
  0,
  0,
  0,
  -10,
  -20,
  -10,
  -10,
  -5,
  -5,
  -10,
  -10,
  -20
];
const KING_MD_SQ = [
  -30,
  -40,
  -40,
  -50,
  -50,
  -40,
  -40,
  -30,
  -30,
  -40,
  -40,
  -50,
  -50,
  -40,
  -40,
  -30,
  -30,
  -40,
  -40,
  -50,
  -50,
  -40,
  -40,
  -30,
  -30,
  -40,
  -40,
  -50,
  -50,
  -40,
  -40,
  -30,
  -20,
  -30,
  -30,
  -40,
  -40,
  -30,
  -30,
  -20,
  -10,
  -20,
  -20,
  -20,
  -20,
  -20,
  -20,
  -10,
  20,
  20,
  0,
  0,
  0,
  0,
  20,
  20,
  20,
  30,
  10,
  0,
  0,
  10,
  30,
  20
];
const KING_END_SQ = [
  -50,
  -40,
  -30,
  -20,
  -20,
  -30,
  -40,
  -50,
  -30,
  -20,
  -10,
  0,
  0,
  -10,
  -20,
  -30,
  -30,
  -10,
  20,
  30,
  30,
  20,
  -10,
  -30,
  -30,
  -10,
  30,
  40,
  40,
  30,
  -10,
  -30,
  -30,
  -10,
  30,
  40,
  40,
  30,
  -10,
  -30,
  -30,
  -10,
  20,
  30,
  30,
  20,
  -10,
  -30,
  -30,
  -30,
  0,
  0,
  0,
  0,
  -30,
  -30,
  -50,
  -30,
  -30,
  -30,
  -30,
  -30,
  -30,
  -50
];
const SQUARE_WEIGHT_TABLES = {
  [WHITE]: {
    p: PAWN_SQ,
    n: KNIGHTS_SQ,
    b: BISHOP_SQ,
    r: ROOK_SQ,
    q: QUEEN_SQ,
    k: { middle: KING_MD_SQ, end: KING_END_SQ }
  },
  [BLACK]: {
    p: PAWN_SQ.slice().reverse(),
    n: KNIGHTS_SQ.slice().reverse(),
    b: BISHOP_SQ.slice().reverse(),
    r: ROOK_SQ.slice().reverse(),
    q: QUEEN_SQ.slice().reverse(),
    k: {
      middle: KING_MD_SQ.slice().reverse(),
      end: KING_END_SQ.slice().reverse()
    }
  }
};
class PieceList {
  constructor() {
    __publicField(this, "list", {});
    __publicField(this, "numPieces", 0);
    __publicField(this, "numNotPawn", 0);
  }
  addPiece(piece) {
    this.list[piece.index] = piece;
    this.numPiece++;
    if (piece.type !== "p")
      this.numNotPawn++;
  }
  deletePiece(piece) {
    delete this.list[piece.index];
    this.numPiece--;
    if (piece.type !== "p")
      this.numNotPawn--;
  }
  mapList(cb) {
    for (const pieceIndex in this.list) {
      cb(this.list[pieceIndex]);
    }
  }
}
class Piece {
  constructor({ index, color, code }) {
    __publicField(this, "index", 0);
    __publicField(this, "color", WHITE);
    __publicField(this, "imgUrl", "");
    __publicField(this, "imgAlt", "");
    __publicField(this, "code", "");
    __publicField(this, "isSlide", false);
    this.index = index;
    this.color = color;
    this.code = code;
    this.type = this.code.toLowerCase();
    this.pieceName = pieceCodeToName[this.type];
    this.isSlide = this.type === pieceCode.bishop || this.type === pieceCode.queen || this.type === pieceCode.rook;
  }
  changePieceType(code) {
    this.code = code;
    this.code = code;
    this.type = this.code.toLowerCase();
    this.pieceName = pieceCodeToName[this.type];
    this.isSlide = this.type === pieceCode.bishop || this.type === pieceCode.queen || this.type === pieceCode.rook;
  }
  get position() {
    return {
      x: this.index % 8,
      y: parseInt(this.index / 8)
    };
  }
  equals(piece) {
    return piece.index === this.index;
  }
}
class Board {
  constructor(fen) {
    __publicField(this, "squares", Array(64).fill(null));
    __publicField(this, "validMoves", []);
    __publicField(this, "kings", {
      [WHITE]: null,
      [BLACK]: null
    });
    __publicField(this, "pieceList", {
      black: new PieceList(),
      white: new PieceList()
    });
    this.fenPosition = fen || DEFAULT_FEN.split(" ")[0];
  }
  getPiece(x, y = null) {
    if (x === -1)
      return null;
    if (y)
      return this.squares[(y - 1) * 8 + (x - 1)];
    else
      return this.squares[x];
  }
  addPiece(piece) {
    this.pieceList[piece.color].addPiece(piece);
    this.squares[piece.index] = piece;
  }
  deletePiece(piece) {
    if (piece) {
      this.pieceList[piece.color].deletePiece(piece);
      this.squares[piece.index] = null;
    }
  }
  mapColorList(color, cb) {
    this.pieceList[color].mapList(cb);
  }
  clear() {
    this.squares = Array(64).fill(null);
    this.pieceList = {
      black: new PieceList(),
      white: new PieceList()
    };
  }
  set fenPosition(fenPosition) {
    this.clear();
    fenPosition.split("/").forEach((rowStr, y) => {
      let x = 0;
      rowStr.split("").forEach((char) => {
        if (parseInt(char)) {
          x += parseInt(char);
        } else {
          const pieceParam = {
            index: y * 8 + x,
            code: char,
            color: char !== char.toLowerCase() ? WHITE : BLACK
          };
          const piece = new Piece(pieceParam);
          this.addPiece(piece);
          if (piece.type === pieceCode.king) {
            this.kings[piece.color] = piece;
          }
          x++;
        }
      });
    });
  }
  get fenPosition() {
    let fen = "";
    let nullCount = 0;
    let rowCount = 0;
    this.squares.forEach((piece) => {
      if (piece == null) {
        nullCount++;
        rowCount++;
      } else {
        fen += nullCount ? nullCount + piece.code : "" + piece.code;
        nullCount = 0;
        rowCount++;
      }
      if (rowCount % 8 === 0) {
        fen += nullCount ? nullCount + "/" : "/";
        nullCount = 0;
        rowCount = 0;
      }
    });
    return fen;
  }
  getColorNotPawnNum(color) {
    return this.pieceList[color].numNotPawn;
  }
  get pieceCount() {
    return this.pieceList.white.numPieces + this.pieceList.black.numPieces;
  }
}
class Move {
  constructor({
    piece,
    targetIndex,
    capture = null,
    enPassant = false,
    enPassantCapture = false,
    castling = 0,
    promotion = null,
    chess
  }) {
    __publicField(this, "piece", null);
    __publicField(this, "startIndex", 0);
    __publicField(this, "targetIndex", 0);
    __publicField(this, "capture", null);
    __publicField(this, "castling", 0);
    __publicField(this, "enPassant", false);
    __publicField(this, "enPassantCapture", false);
    __publicField(this, "promotion", null);
    __publicField(this, "score", 0);
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
  indexToPosition(index) {
    return {
      y: parseInt(index / 8),
      x: index % 8
    };
  }
  indexToString(index) {
    return "" + RANKS[index % 8] + (8 - parseInt(index / 8));
  }
  get startPosition() {
    return this.indexToPosition(this.startIndex);
  }
  get targetPosition() {
    return this.indexToPosition(this.targetIndex);
  }
  get startString() {
    return this.indexToString(this.startIndex);
  }
  get targetString() {
    return this.indexToString(this.targetIndex);
  }
  get isTargetLastFile() {
    if (this.piece.color === WHITE)
      return this.targetPosition.y === 0;
    else
      return this.targetPosition.y === 7;
  }
  get pretty() {
    let castling = false;
    if (this.castling & K_SIDE_CASTLE)
      castling = "king-side";
    else if (this.castling & Q_SIDE_CASTLE)
      castling = "queen-side";
    return {
      san: this.san,
      piece: this.piece.type,
      from: this.startString,
      to: this.targetString,
      castling,
      capture: this.capture ? this.capture.type : null,
      promotion: this.promotion,
      enPassant: this.enPassant
    };
  }
  getSanConflict(moves) {
    let conflict = "";
    const startPosition = this.startPosition;
    let sameRank = false, sameFile = false;
    for (const move of moves) {
      if (move.piece.type === this.piece.type && move.startIndex !== this.startIndex && move.targetIndex === this.targetIndex) {
        if (startPosition.x === move.startPosition.x)
          sameRank = true;
        if (startPosition.y === move.startPosition.y)
          sameFile = true;
        if (sameRank && sameFile)
          break;
      }
    }
    if (sameFile)
      conflict += RANKS[startPosition.x];
    if (sameRank)
      conflict += 8 - startPosition.y;
    return conflict;
  }
  setSAN(moves) {
    this.san = "";
    if (this.castling === K_SIDE_CASTLE)
      this.san = "o-o";
    else if (this.castling === Q_SIDE_CASTLE)
      this.san = "o-o-o";
    else {
      if (this.piece.type !== pieceCode.pawn) {
        this.san += this.piece.type.toUpperCase();
        this.san += this.getSanConflict(moves);
      }
      if (this.capture) {
        if (this.piece.type === pieceCode.pawn) {
          this.san += RANKS[this.startPosition.x];
        }
        this.san += "x";
      }
      this.san += this.targetString;
      if (this.promotion)
        this.san += "=" + this.promotion.toUpperCase();
    }
  }
  setScore(chess) {
    if (this.capture)
      this.score += Coefficients[this.capture.type];
    if (this.promotion)
      this.score += Coefficients[this.promotion];
    if (chess.inAttack(this.targetIndex, this.piece.color))
      this.score -= Coefficients[this.piece.type];
    if (this.piece.type !== pieceCode.pawn && chess.inPawnAttack(this.targetIndex, this.piece.color))
      this.score -= Coefficients[this.piece.type];
  }
  static generatePawnMoves(piece, chess, moves, onlyCapture = false) {
    const validMoves = pieceCodeToMoveOffsets[piece.type][piece.color].map((offset) => offset + piece.index);
    const moveParams = {
      piece,
      targetIndex: validMoves[0],
      chess
    };
    if (!onlyCapture) {
      this.generatePawnForward(piece, chess, moves, validMoves, moveParams);
    }
    for (const offset of mailboxOffsets.p[piece.color]) {
      let index = piece.index;
      index = mailbox[mailbox64[index] + offset];
      if (index !== -1) {
        this.generatePawnCapture(piece, chess, moves, validMoves, moveParams, offset, index);
      }
    }
  }
  static generatePawnForward(piece, chess, moves, validMoves, moveParams) {
    const secondRow = secondRowsWithColor[piece.color];
    if (!this.isIndexValid(validMoves[0]))
      return [];
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
  }
  static generatePawnCapture(piece, chess, moves, validMoves, moveParams, offset, index) {
    const enPassantCaptureIndex = offset < 0 ? chess.enPassantIndex - 8 : chess.enPassantIndex + 8;
    const capture = chess.getPiece(index);
    if (capture && capture.color != piece.color) {
      moveParams.targetIndex = capture.index;
      moveParams.capture = capture;
      if (parseInt(validMoves[0] / 8) === lastFileWithColor[piece.color]) {
        this.generatePromotionMoves(moves, moveParams);
      } else {
        moves.push(new Move(moveParams));
      }
    } else if (index === enPassantCaptureIndex) {
      const enPassantPiece = chess.getPiece(chess.enPassantIndex);
      moveParams.capture = enPassantPiece;
      moveParams.targetIndex = enPassantCaptureIndex;
      moves.push(new Move(moveParams));
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
  static generatePieceMoves(piece, chess, moves, onlyCapture = false) {
    const offsets = mailboxOffsets[piece.type];
    const moveParams = {
      piece,
      capture: null,
      chess
    };
    for (const offset of offsets) {
      let index = piece.index;
      index = mailbox[mailbox64[index] + offset];
      while (index != -1) {
        const sq = chess.getPiece(index);
        if (sq != null) {
          if (sq.color != piece.color) {
            moveParams.capture = sq;
            moveParams.targetIndex = index;
            moves.push(new Move(moveParams));
            moveParams.capture = null;
          }
          break;
        }
        if (!onlyCapture) {
          moveParams.targetIndex = index;
          moves.push(new Move(moveParams));
        }
        if (!piece.isSlide)
          break;
        index = mailbox[mailbox64[index] + offset];
      }
    }
    if (piece.type === pieceCode.king) {
      this.generateCastleMoves(piece, chess, moves);
    }
  }
  static generateCastleMoves(piece, chess, moves) {
    const moveParams = {
      piece,
      chess
    };
    const index = piece.index;
    if (chess.castling[piece.color] & K_SIDE_CASTLE) {
      if (!chess.getPiece(index + 1) && !chess.getPiece(index + 2) && !chess.inCheck() && !chess.inAttack(index + 1, piece.color) && !chess.inAttack(index + 2, piece.color)) {
        moveParams.castling = K_SIDE_CASTLE;
        moveParams.targetIndex = piece.index + 2;
        moves.push(new Move(moveParams));
      }
    }
    if (chess.castling[piece.color] & Q_SIDE_CASTLE) {
      if (!chess.getPiece(index - 1) && !chess.getPiece(index - 2) && !chess.getPiece(index - 3) && !chess.inCheck() && !chess.inAttack(index - 1, piece.color) && !chess.inAttack(index - 2, piece.color) && !chess.inAttack(index - 3, piece.color)) {
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
const randomNumberMultiply = 1e17;
class Zobrist {
  constructor(chess) {
    __publicField(this, "pieceKeys", {
      [WHITE]: [],
      [BLACK]: []
    });
    __publicField(this, "castlingKeys", {
      [WHITE]: [],
      [BLACK]: []
    });
    __publicField(this, "enPassantKeys", {
      [WHITE]: [],
      [BLACK]: []
    });
    __publicField(this, "sideToMove", 0);
    __publicField(this, "hash", 0);
    __publicField(this, "pieceTypes", ["p", "b", "n", "r", "q", "k"]);
    this.chess = chess;
    for (let i = 0; i < 64; i++) {
      this.pieceKeys[WHITE][i] = {};
      this.pieceKeys[BLACK][i] = {};
      for (const pieceType of this.pieceTypes) {
        this.pieceKeys[WHITE][i][pieceType] = this.randomNumber;
        this.pieceKeys[BLACK][i][pieceType] = this.randomNumber;
      }
    }
    for (let i = 0; i < 4; i++) {
      this.castlingKeys[WHITE][i] = this.randomNumber;
      this.castlingKeys[BLACK][i] = this.randomNumber;
    }
    for (let i = 0; i < 8; i++) {
      this.enPassantKeys[WHITE][i] = this.randomNumber;
      this.enPassantKeys[BLACK][i] = this.randomNumber;
    }
    this.sideToMove = this.randomNumber;
  }
  get randomNumber() {
    return Math.floor(Math.random() * randomNumberMultiply);
  }
  loadMove(move) {
    const piece = move.piece;
    const capture = move.capture;
    if (capture) {
      this.hash ^= this.getPieceKey(capture);
    }
    if (move.castling & K_SIDE_CASTLE) {
      const rook = this.chess.getPiece(rookSides[piece.color].k);
      this.hash ^= this.getPieceKey(rook);
      this.hash ^= this.pieceKeys[rook.color][rook.index - 2][rook.type];
    } else if (move.castling & Q_SIDE_CASTLE) {
      const rook = this.chess.getPiece(rookSides[piece.color].q);
      this.hash ^= this.getPieceKey(rook);
      this.hash ^= this.pieceKeys[rook.color][rook.index + 3][rook.type];
    }
    if (move.enPassant) {
      this.hash ^= this.enPassantKeys[move.targetIndex % 8];
    }
    this.hash ^= this.sideToMove;
    this.hash ^= this.getPieceKey(piece);
    const targetPiece = this.chess.getPiece(move.targetIndex);
    if (targetPiece)
      this.hash ^= this.getPieceKey(targetPiece);
    this.hash ^= this.pieceKeys[piece.color][move.targetIndex][piece.type];
    if (this.chess.enPassantIndex != 0)
      this.hash ^= this.enPassantKeys[this.chess.enPassantIndex % 8];
  }
  getPieceKey(piece) {
    return this.pieceKeys[piece.color][piece.index][piece.type];
  }
  loadBoard() {
    this.hash = this.calculate(this.chess);
  }
  calculate() {
    let zobristKey = 0;
    for (const piece of this.chess.board.squares) {
      if (piece) {
        zobristKey ^= this.getPieceKey(piece);
      }
    }
    if (this.chess.enPassantIndex) {
      zobristKey ^= this.enPassantKeys[this.chess.enPassantIndex % 8];
    }
    if (this.chess.currentPlayer === BLACK) {
      zobristKey ^= this.sideToMove;
    }
    zobristKey ^= this.castlingKeys[this.chess.castling];
    return zobristKey;
  }
}
class ChessGame {
  constructor(fen = DEFAULT_FEN) {
    __publicField(this, "currentPlayer", WHITE);
    __publicField(this, "castling", {
      [WHITE]: 0,
      [BLACK]: 0
    });
    __publicField(this, "enPassantIndex", null);
    __publicField(this, "halfMoveCount", 0);
    __publicField(this, "moveCount", 1);
    __publicField(this, "moves", []);
    __publicField(this, "uglyMoves", []);
    __publicField(this, "history", []);
    __publicField(this, "redoHistory", []);
    __publicField(this, "hashHistory", []);
    this.board = new Board();
    this.zobrist = new Zobrist(this);
    this.fen = fen;
    this.buildMoves();
    this.zobrist.loadBoard();
  }
  generatePseudoLegalMoves(onlyCapture = false) {
    const moves = [];
    this.board.mapColorList(this.currentPlayer, (piece) => {
      if (piece.type === pieceCode.pawn)
        Move.generatePawnMoves(piece, this, moves, onlyCapture);
      else
        Move.generatePieceMoves(piece, this, moves, onlyCapture);
    });
    return moves;
  }
  generateMoves(options) {
    let pseudoMoves = this.generatePseudoLegalMoves(options == null ? void 0 : options.onlyCapture);
    const currentPlayer = this.currentPlayer;
    const legalMoves = [];
    for (const pseudoMove of pseudoMoves) {
      this.makeUglyMove(pseudoMove);
      if (!this.inCheck(currentPlayer)) {
        legalMoves.push(pseudoMove);
      }
      this.undoUglyMove();
    }
    if (this.inDoubleCheck())
      return legalMoves.filter((move) => move.piece.type === pieceCode.king);
    return legalMoves;
  }
  buildMoves() {
    this.uglyMoves = this.generateMoves();
    this.uglyMoves.forEach((uglyMove) => uglyMove.setSAN(this.uglyMoves));
    this.moves = this.uglyMoves.map((uglyMove) => uglyMove.pretty);
  }
  getPiece(x, y = null) {
    return this.board.getPiece(x, y);
  }
  getPieceMoves(piece) {
    return this.uglyMoves.filter((move) => move.piece.equals(piece));
  }
  checkCastlingBeforeMove(move) {
    const piece = move.piece;
    if (piece.type === pieceCode.king)
      this.castling[piece.color] = 0;
    else if (piece.type === pieceCode.rook) {
      if (piece.index === rookSides[piece.color].k)
        this.castling[piece.color] &= Q_SIDE_CASTLE;
      else if (piece.index === rookSides[piece.color].q)
        this.castling[piece.color] &= K_SIDE_CASTLE;
    }
  }
  generateHistory(move) {
    this.history.push({
      move,
      castling: {
        [WHITE]: this.castling[WHITE],
        [BLACK]: this.castling[BLACK]
      },
      enPassantIndex: this.enPassantIndex,
      halfMoveCount: this.halfMoveCount,
      moveCount: this.moveCount,
      currentPlayer: this.currentPlayer
    });
    this.hashHistory.push(this.zobrist.hash);
  }
  makeUglyMove(move) {
    this.generateHistory(move);
    this.zobrist.loadMove(move);
    this.board.deletePiece(move.piece);
    this.enPassantIndex = move.enPassant ? move.targetIndex : null;
    if (this.currentPlayer === BLACK)
      this.moveCount++;
    this.currentPlayer = this.opponentColor;
    this.checkCastlingBeforeMove(move);
    if (move.capture) {
      const capturePiece = this.getPiece(move.capture.index);
      this.board.deletePiece(capturePiece);
    }
    if (move.piece.type === pieceCode.pawn) {
      this.makePawnMove(move);
    } else if (move.castling) {
      this.makeCastlingMove(move);
    } else {
      const piece = move.piece;
      piece.index = move.targetIndex;
      this.board.addPiece(piece);
    }
    if (move.piece.type === pieceCode.king)
      this.board.kings[move.piece.color] = move.piece;
    if (move.piece.type === pieceCode.pawn || move.capture)
      this.halfMoveCount = 0;
    else
      this.halfMoveCount++;
  }
  convertToMove(move) {
    let uglyMove = false;
    if ((move == null ? void 0 : move.startIndex) && (move == null ? void 0 : move.targetIndex))
      uglyMove = move;
    else if (typeof move === "string") {
      uglyMove = this.uglyMoves.find((_uglyMove) => _uglyMove.san === move);
    } else {
      uglyMove = this.uglyMoves.find((_uglyMove) => {
        if ((move == null ? void 0 : move.from) === _uglyMove.startString && (move == null ? void 0 : move.to) === _uglyMove.targetString) {
          if (_uglyMove.promotion) {
            return _uglyMove.promotion === move.promotion;
          }
          return true;
        }
      });
    }
    return uglyMove;
  }
  validateMove(move) {
    return !!this.convertToMove(move);
  }
  makeMove(move) {
    if (!this.validateMove(move))
      return false;
    this.makeUglyMove(this.convertToMove(move));
    this.redoHistory = [];
    this.buildMoves();
    return true;
  }
  undoUglyMove() {
    if (this.history.length > 0) {
      const old = this.history.pop();
      const oldHash = this.hashHistory.pop();
      const move = old.move;
      const capture = move.capture;
      const piece = move.piece;
      const promotion = move.promotion;
      if (promotion) {
        piece.changePieceType(pieceTypeToCode[piece.color].p);
      }
      this.castling = old.castling;
      this.enPassantIndex = old.enPassantIndex;
      this.halfMoveCount = old.halfMoveCount;
      this.moveCount = old.moveCount;
      this.currentPlayer = old.currentPlayer;
      this.zobrist.hash = oldHash;
      this.board.deletePiece(piece);
      piece.index = move.startIndex;
      this.board.addPiece(piece);
      if (capture) {
        this.board.addPiece(capture);
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
        this.board.deletePiece(rook);
        rook.index = rookStartIndex;
        this.board.addPiece(rook);
      }
    }
  }
  undoMove() {
    this.redoHistory.push(this.history[this.history.length - 1]);
    this.undoUglyMove();
    this.buildMoves();
  }
  redoMove() {
    if (this.redoHistory.length > 0) {
      const redo = this.redoHistory.pop();
      this.makeUglyMove(redo.move);
      this.buildMoves();
    }
  }
  makeCastlingMove(move) {
    const piece = move.piece;
    if (move.castling & K_SIDE_CASTLE) {
      piece.index += 2;
      this.board.addPiece(piece);
      const rook = this.getPiece(rookSides[piece.color].k);
      this.board.deletePiece(rook);
      rook.index -= 2;
      this.board.addPiece(rook);
    } else if (move.castling & Q_SIDE_CASTLE) {
      piece.index -= 2;
      this.board.addPiece(piece);
      const rook = this.getPiece(rookSides[piece.color].q);
      this.board.deletePiece(rook);
      rook.index += 3;
      this.board.addPiece(rook);
    }
    this.castling[piece.color] = 0;
  }
  makePawnMove(move) {
    const piece = move.piece;
    piece.index = move.targetIndex;
    if (move.promotion) {
      piece.changePieceType(pieceTypeToCode[piece.color][move.promotion]);
    }
    this.board.addPiece(piece);
  }
  loadGameWithFen(fen) {
    this.fen = fen;
    this.buildMoves();
  }
  inKnightAttack(_index, color, returnCount = false) {
    let count = 0;
    for (const knightOffset of mailboxKingAttackOffsets.n) {
      let index = _index;
      index = mailbox[mailbox64[index] + knightOffset];
      const sq = this.getPiece(index);
      if (sq && sq.type === pieceCode.knight && sq.color !== color) {
        if (!returnCount)
          return true;
        count++;
      }
    }
    return returnCount ? count : false;
  }
  inPawnAttack(_index, color, returnCount = false) {
    const opponentColor = this.getOpponentColor(color);
    let count = 0;
    for (const pawnOffset of mailboxKingAttackOffsets.p[opponentColor]) {
      let index = _index;
      index = mailbox[mailbox64[index] + pawnOffset];
      const sq = this.getPiece(index);
      if (sq && sq.type === pieceCode.pawn && sq.color !== color) {
        if (!returnCount)
          return true;
        count++;
      }
    }
    return returnCount ? count : false;
  }
  inKingAttack(_index, color, returnCount = false) {
    let count = 0;
    for (const kingOffset of mailboxKingAttackOffsets.k) {
      let index = _index;
      index = mailbox[mailbox64[index] + kingOffset];
      const sq = this.getPiece(index);
      if (sq && sq.type === pieceCode.king && sq.color !== color) {
        if (!returnCount)
          return true;
        count++;
      }
    }
    return returnCount ? count : false;
  }
  inSlidingAttack(_index, color, returnCount = false) {
    const offsets = mailboxOffsets.k;
    let count = 0;
    for (const offset of offsets) {
      let index = _index;
      index = mailbox[mailbox64[index] + offset];
      while (index != -1 && index != void 0) {
        const sq = this.getPiece(index);
        if (sq != null) {
          let captureOffsets = mailboxOffsets[sq.type];
          if (sq.isSlide && sq.color !== color && captureOffsets.includes(offset)) {
            if (!returnCount)
              return true;
            count++;
          }
          break;
        }
        index = mailbox[mailbox64[index] + offset];
      }
    }
    return returnCount ? count : false;
  }
  inAttack(index, color, returnCount = false) {
    if (returnCount) {
      return this.inKnightAttack(index, color, returnCount) + this.inPawnAttack(index, color, returnCount) + this.inSlidingAttack(index, color, returnCount) + this.inKingAttack(index, color, returnCount);
    }
    return this.inKnightAttack(index, color) || this.inPawnAttack(index, color) || this.inSlidingAttack(index, color) || this.inKingAttack(index, color);
  }
  inCheck(color = this.currentPlayer) {
    return this.inAttack(this.board.kings[color].index, color);
  }
  inDoubleCheck(color = this.currentPlayer) {
    return this.inAttack(this.board.kings[color].index, color, true) > 1;
  }
  perft(depth) {
    let totalMove = 0;
    let captures = 0;
    const moves = this.generatePseudoLegalMoves();
    for (const move of moves) {
      this.makeUglyMove(move);
      if (!this.inCheck()) {
        if (depth - 1 > 0) {
          const perft = this.perft(depth - 1);
          totalMove += perft.count;
          captures += perft.captures;
        } else {
          totalMove++;
          if (move.capture)
            captures++;
        }
      }
      this.undoUglyMove();
    }
    return { count: totalMove, captures };
  }
  getOpponentColor(color) {
    return color === WHITE ? BLACK : WHITE;
  }
  get boardArray() {
    return this.board.squares;
  }
  get opponentColor() {
    return this.currentPlayer === WHITE ? BLACK : WHITE;
  }
  get inThreeFold() {
    if (!this.hashHistory.length)
      return false;
    return this.hashHistory.filter((x) => x === this.zobrist.hash).length >= 3;
  }
  get inFiftyMove() {
    return this.halfMoveCount >= 100;
  }
  get gameOver() {
    return !this.uglyMoves.length || this.board.pieceCount === 2 || this.inThreeFold || this.inFiftyMove;
  }
  get winner() {
    if (this.gameOver) {
      if (this.inCheck() && this.uglyMoves.length === 0) {
        return this.currentPlayer === WHITE ? BLACK : WHITE;
      } else {
        return "draw";
      }
    } else {
      return false;
    }
  }
  get enPassant() {
    const enPassant = this.fenEnPassant;
    return enPassant === "-" ? null : enPassant;
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
    if (this.enPassantIndex === null)
      return "-";
    else {
      const char = this.enPassantIndex % 8 + 97;
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
class TranspositionTable {
  constructor(game) {
    __publicField(this, "hashes", {});
    this.game = game;
  }
  get hash() {
    return this.game.zobrist.hash;
  }
  clear() {
    this.hashes = {};
  }
  getHash(game) {
    if (game)
      return game.zobrist.hash;
    else
      return this.hash;
  }
  getMove(game = null) {
    const hash = this.getHash(game);
    return entries[hash].move;
  }
  getStoredHash({ depth, alpha, beta }, game = null) {
    const hash = this.getHash(game);
    const storedHash = this.hashes[hash];
    if (storedHash && depth <= storedHash.depth) {
      if (storedHash.type === TT_EXACT)
        return storedHash;
      if (storedHash.type === TT_LOWER && storedHash.score >= beta)
        return storedHash;
      if (storedHash.type === TT_UPPER && storedHash.score <= alpha)
        return storedHash;
    }
    return null;
  }
  addEvaluation(newHash, game = null) {
    const hash = this.getHash(game);
    newHash.hash = hash;
    this.hashes[hash] = newHash;
  }
}
class ChessAI {
  constructor(type = "normal", depth = 1) {
    __publicField(this, "positionCount", 0);
    __publicField(this, "cutOff", 0);
    __publicField(this, "quiesceCount", 0);
    __publicField(this, "transpositionNum", 0);
    __publicField(this, "bestEval", null);
    this.type = type;
    this.depth = depth;
    this.transpositionTable = new TranspositionTable(this.game);
    this.bestMove = null;
  }
  selectMove(fen, options) {
    const type = (options == null ? void 0 : options.type) || this.type;
    const depth = (options == null ? void 0 : options.depth) || this.depth;
    if (fen)
      this.game = new ChessGame(fen);
    else
      return null;
    if (type === "random")
      return this.selectRandomMove(this.game.uglyMoves);
    if (type === "normal") {
      if (options == null ? void 0 : options.debug)
        this.resetDebug();
      this.bestMove = null;
      this.search(depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, this.game);
      if (options == null ? void 0 : options.debug)
        this.logDebug();
      this.bestMove.setSAN(this.game.uglyMoves);
      return this.bestMove.pretty;
    }
  }
  resetDebug() {
    this.positionCount = 0;
    this.quiesceCount = 0;
    this.cutOff = 0;
    this.transpositionNum = 0;
    this.bestEval = null;
  }
  logDebug() {
    console.log("*************************");
    console.log("eval: ", this.bestEval);
    console.log("searched position: ", this.positionCount);
    console.log("cut off count: ", this.cutOff);
    console.log("quiesce count: ", this.quiesceCount);
    console.log("transposition count: ", this.transpositionNum, Object.keys(this.transpositionTable.hashes).length);
  }
  selectRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  }
  search(depth, alpha, beta, game, root = 0) {
    if (root > 0 && game.hashHistory.includes(game.zobrist.hash))
      return 0;
    const storedHash = this.transpositionTable.getStoredHash({
      depth,
      alpha,
      beta
    }, game);
    if (storedHash !== null) {
      this.transpositionNum++;
      if (root === 0)
        this.bestMove = storedHash.move;
      return storedHash.score;
    }
    if (depth === 0) {
      this.positionCount++;
      return this.quiesce(alpha, beta, game);
    }
    const moves = game.generateMoves();
    if (moves.length === 0) {
      if (game.inCheck()) {
        return Number.NEGATIVE_INFINITY;
      }
      return 0;
    }
    let tt_type = TT_UPPER;
    let bestMove;
    moves.sort((a, b) => b.score - a.score);
    for (const move of moves) {
      game.makeUglyMove(move);
      let evaluation = -this.search(depth - 1, -beta, -alpha, game, root + 1);
      game.undoUglyMove();
      if (evaluation >= beta) {
        this.cutOff++;
        this.transpositionTable.addEvaluation({
          depth,
          move,
          score: beta,
          type: TT_LOWER
        }, game);
        return beta;
      }
      if (evaluation > alpha) {
        tt_type = TT_EXACT;
        alpha = evaluation;
        bestMove = move;
        if (root === 0) {
          this.bestEval = alpha;
          this.bestMove = bestMove;
        }
      }
    }
    this.transpositionTable.addEvaluation({
      depth,
      move: bestMove,
      score: alpha,
      type: tt_type
    }, game);
    return alpha;
  }
  quiesce(alpha, beta, game) {
    this.quiesceCount++;
    const stand_pat = this.evaluate(game);
    if (stand_pat >= beta)
      return beta;
    if (alpha < stand_pat)
      alpha = stand_pat;
    const captureMoves = game.generateMoves({ onlyCapture: true });
    captureMoves.sort((a, b) => b.score - a.score);
    for (const move of captureMoves) {
      game.makeUglyMove(move);
      const score = -this.quiesce(-beta, -alpha, game);
      game.undoUglyMove();
      if (score >= beta)
        return beta;
      if (score > alpha)
        alpha = score;
    }
    return alpha;
  }
  getEndGameWeight(notPawnCount) {
    return 1 - Math.min(1, notPawnCount * (1 / endGameValue));
  }
  endGameEval(friendlyKing, opponentKing, friendlyNotPawnMaterial, endGameWeight) {
    let evaluation = 0;
    const { x: opponentKingX, y: opponentKingY } = opponentKing.position;
    const opponentDestDiffX = Math.max(3 - opponentKingX, opponentKingX - 4);
    const opponentDestDiffY = Math.max(3 - opponentKingY, opponentKingY - 4);
    const opponentDestDiff = opponentDestDiffX + opponentDestDiffY;
    evaluation += opponentDestDiff;
    const { x: friendKingX, y: friendKingY } = friendlyKing.position;
    const betweenDestX = Math.abs(friendKingX - opponentKingX);
    const betweenDestY = Math.abs(friendKingY - opponentKingY);
    const betweenDest = betweenDestX + betweenDestY;
    evaluation += 14 - betweenDest;
    return evaluation * 10 * endGameWeight;
  }
  evaluate(_game) {
    const game = this.game || _game;
    const board = game.board;
    const kings = board.kings;
    let whiteEval = 0;
    let blackEval = 0;
    const whiteMaterial = this.getColorMaterial(WHITE, board);
    const blackMaterial = this.getColorMaterial(BLACK, board);
    whiteEval += whiteMaterial;
    blackEval += blackMaterial;
    const whiteNotPawnMaterial = whiteMaterial - board.getColorNotPawnNum(WHITE) * Coefficients.p;
    const blackNotPawnMaterial = blackMaterial - board.getColorNotPawnNum(BLACK) * Coefficients.p;
    const whiteEndGameWeight = this.getEndGameWeight(whiteNotPawnMaterial);
    const blackEndGameWeight = this.getEndGameWeight(blackNotPawnMaterial);
    whiteEval += this.endGameEval(kings.white, kings.black, whiteNotPawnMaterial, whiteEndGameWeight);
    blackEval += this.endGameEval(kings.black, kings.white, blackNotPawnMaterial, blackEndGameWeight);
    whiteEval += this.getPieceWeights(WHITE, whiteNotPawnMaterial, board);
    blackEval += this.getPieceWeights(BLACK, blackNotPawnMaterial, board);
    return (whiteEval - blackEval) * Coefficients[game.currentPlayer];
  }
  getColorMaterial(color, board) {
    let colorEval = 0;
    board.mapColorList(color, (piece) => {
      colorEval += Coefficients[piece.type];
    });
    return colorEval;
  }
  getPieceWeights(color, notPawnMaterial, board) {
    let colorEval = 0;
    board.mapColorList(color, (piece) => {
      if (piece.type !== pieceCode.king) {
        colorEval += SQUARE_WEIGHT_TABLES[piece.color][piece.type][piece.index];
        return;
      }
      if (notPawnMaterial > endGameValue)
        colorEval += SQUARE_WEIGHT_TABLES[piece.color][piece.type]["middle"][piece.index];
      else
        colorEval += SQUARE_WEIGHT_TABLES[piece.color][piece.type]["end"][piece.index];
    });
    return colorEval;
  }
}
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$e = {
  name: "WhiteBishop",
  props: {
    size: Number
  }
};
const _hoisted_1$d = ["width", "height"];
const _hoisted_2$d = /* @__PURE__ */ createStaticVNode('<g id="surface1"><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 9 36.001562 C 12.390625 35.028906 19.109375 36.43125 22.5 34.001562 C 25.890625 36.43125 32.609375 35.028906 36 36.001562 C 36 36.001562 37.648438 36.540625 39 38.001562 C 38.320312 38.970312 37.351562 38.989844 36 38.501562 C 32.609375 37.528906 25.890625 38.958594 22.5 37.501562 C 19.109375 38.958594 12.390625 37.528906 9 38.501562 C 7.648438 38.989844 6.679688 38.970312 6 38.001562 C 7.351562 36.540625 9 36.001562 9 36.001562 Z M 9 36.001562 " transform="matrix(1,0,0,1,0,0.6)"></path><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 15 32.001562 C 17.5 34.501562 27.5 34.501562 30 32.001562 C 30.5 30.501562 30 30.001562 30 30.001562 C 30 27.501562 27.5 26.001562 27.5 26.001562 C 33 24.501562 33.5 14.501563 22.5 10.501563 C 11.5 14.501563 12 24.501562 17.5 26.001562 C 17.5 26.001562 15 27.501562 15 30.001562 C 15 30.001562 14.5 30.501562 15 32.001562 Z M 15 32.001562 " transform="matrix(1,0,0,1,0,0.6)"></path><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 25 8.001563 C 25 9.380469 23.878906 10.501563 22.5 10.501563 C 21.121094 10.501563 20 9.380469 20 8.001563 C 20 6.61875 21.121094 5.501563 22.5 5.501563 C 23.878906 5.501563 25 6.61875 25 8.001563 Z M 25 8.001563 " transform="matrix(1,0,0,1,0,0.6)"></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:miter;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 17.5 26.001562 L 27.5 26.001562 M 15 30.001562 L 30 30.001562 M 22.5 15.501563 L 22.5 20.501562 M 20 18.001562 L 25 18.001562 " transform="matrix(1,0,0,1,0,0.6)"></path></g>', 1);
const _hoisted_3$c = [
  _hoisted_2$d
];
function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 45 45",
    version: "1.1"
  }, _hoisted_3$c, 8, _hoisted_1$d);
}
var WhiteBishop = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e]]);
const _sfc_main$d = {
  name: "WhiteKing",
  props: {
    size: Number
  }
};
const _hoisted_1$c = ["width", "height"];
const _hoisted_2$c = /* @__PURE__ */ createStaticVNode('<g id="surface1"><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:miter;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 22.5 11.628906 L 22.5 6 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:miter;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 20 8 L 25 8 "></path><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 22.5 25 C 22.5 25 27 17.5 25.5 14.5 C 25.5 14.5 24.5 12 22.5 12 C 20.5 12 19.5 14.5 19.5 14.5 C 18 17.5 22.5 25 22.5 25 "></path><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12.5 37 C 18 40.5 27 40.5 32.5 37 L 32.5 30 C 32.5 30 41.5 25.5 38.5 19.5 C 34.5 13 25 16 22.5 23.5 L 22.5 27 L 22.5 23.5 C 20 16 10.5 13 6.5 19.5 C 3.5 25.5 12.5 30 12.5 30 L 12.5 37 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12.5 30 C 18 27 27 27 32.5 30 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12.5 33.5 C 18 30.5 27 30.5 32.5 33.5 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12.5 37 C 18 34 27 34 32.5 37 "></path></g>', 1);
const _hoisted_3$b = [
  _hoisted_2$c
];
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 45 45",
    version: "1.1"
  }, _hoisted_3$b, 8, _hoisted_1$c);
}
var WhiteKing = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d]]);
const _sfc_main$c = {
  name: "WhiteKnight",
  props: {
    size: Number
  }
};
const _hoisted_1$b = ["width", "height"];
const _hoisted_2$b = /* @__PURE__ */ createStaticVNode('<g id="surface1"><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 22 10.000781 C 32.5 11.000781 38.5 18.000781 38 39.000781 L 15 39.000781 C 15 30.000781 25 32.500781 23 18.000781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 24 18.000781 C 24.378906 20.910937 18.449219 25.371875 16 27.000781 C 13 29.000781 13.179688 31.340625 11 31.000781 C 9.957031 30.059375 12.410156 27.961719 11 28.000781 C 10 28.000781 11.191406 29.23125 10 30.000781 C 9 30.000781 5.996094 31.000781 6 26.000781 C 6 24.000781 12 14.000781 12 14.000781 C 12 14.000781 13.890625 12.098437 14 10.500781 C 13.269531 9.504687 13.5 8.500781 13.5 7.500781 C 14.5 6.500781 16.5 10.000781 16.5 10.000781 L 18.5 10.000781 C 18.5 10.000781 19.28125 8.008594 21 7.000781 C 22 7.000781 22 10.000781 22 10.000781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 9.5 25.500781 C 9.5 25.774219 9.277344 26.000781 9 26.000781 C 8.722656 26.000781 8.5 25.774219 8.5 25.500781 C 8.5 25.223437 8.722656 25.000781 9 25.000781 C 9.277344 25.000781 9.5 25.223437 9.5 25.500781 Z M 9.5 25.500781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 15.000905 15.50038 C 14.999749 16.326502 14.776004 17.001477 14.499328 16.998836 C 14.224605 16.999578 13.99872 16.327096 13.999876 15.500973 C 13.99908 14.671468 14.224777 13.999876 14.4995 13.999134 C 14.776176 14.001775 15.000108 14.670874 15.000905 15.50038 Z M 15.000905 15.50038 " transform="matrix(0.866,0.5,-0.5,0.866,9.693,-4.873)"></path></g>', 1);
const _hoisted_3$a = [
  _hoisted_2$b
];
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 45 45",
    version: "1.1"
  }, _hoisted_3$a, 8, _hoisted_1$b);
}
var WhiteKnight = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c]]);
const _sfc_main$b = {
  name: "WhitePawn",
  props: {
    size: Number
  }
};
const _hoisted_1$a = ["width", "height"];
const _hoisted_2$a = /* @__PURE__ */ createElementVNode("g", { id: "surface1" }, [
  /* @__PURE__ */ createElementVNode("path", {
    style: { "fill-rule": "nonzero", "fill": "rgb(100%, 100%, 100%)", "fill-opacity": "1", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "miter", "stroke": "rgb(0%, 0%, 0%)", "stroke-opacity": "1", "stroke-miterlimit": "4" },
    d: "M 22.5 9 C 20.289062 9 18.5 10.789062 18.5 13 C 18.5 13.890625 18.789062 14.710938 19.28125 15.378906 C 17.328125 16.5 16 18.589844 16 21 C 16 23.03125 16.941406 24.839844 18.410156 26.03125 C 15.410156 27.089844 11 31.578125 11 39.5 L 34 39.5 C 34 31.578125 29.589844 27.089844 26.589844 26.03125 C 28.058594 24.839844 29 23.03125 29 21 C 29 18.589844 27.671875 16.5 25.71875 15.378906 C 26.210938 14.710938 26.5 13.890625 26.5 13 C 26.5 10.789062 24.710938 9 22.5 9 Z M 22.5 9 "
  })
], -1);
const _hoisted_3$9 = [
  _hoisted_2$a
];
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 45 45",
    version: "1.1"
  }, _hoisted_3$9, 8, _hoisted_1$a);
}
var WhitePawn = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b]]);
const _sfc_main$a = {
  name: "WhiteQueen",
  props: {
    size: Number
  }
};
const _hoisted_1$9 = ["width", "height"];
const _hoisted_2$9 = /* @__PURE__ */ createStaticVNode('<g id="surface1"><path style="fill-rule:nonzero;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 9 26 C 17.5 24.5 30 24.5 36 26 L 38.5 13.5 L 31 25 L 30.699219 10.898438 L 25.5 24.5 L 22.5 10 L 19.5 24.5 L 14.300781 10.898438 L 14 25 L 6.5 13.5 Z M 9 26 "></path><path style="fill-rule:nonzero;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 9 26 C 9 28 10.5 28 11.5 30 C 12.5 31.5 12.5 31 12 33.5 C 10.5 34.5 11 36 11 36 C 9.5 37.5 11 38.5 11 38.5 C 17.5 39.5 27.5 39.5 34 38.5 C 34 38.5 35.5 37.5 34 36 C 34 36 34.5 34.5 33 33.5 C 32.5 31 32.5 31.5 33.5 30 C 34.5 28 36 28 36 26 C 27.5 24.5 17.5 24.5 9 26 Z M 9 26 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 11.5 30 C 15 29 30 29 33.5 30 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12 33.5 C 18 32.5 27 32.5 33 33.5 "></path><path style="fill-rule:nonzero;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 8 12 C 8 13.105469 7.105469 14 6 14 C 4.894531 14 4 13.105469 4 12 C 4 10.894531 4.894531 10 6 10 C 7.105469 10 8 10.894531 8 12 Z M 8 12 "></path><path style="fill-rule:nonzero;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 16 9 C 16 10.105469 15.105469 11 14 11 C 12.894531 11 12 10.105469 12 9 C 12 7.894531 12.894531 7 14 7 C 15.105469 7 16 7.894531 16 9 Z M 16 9 "></path><path style="fill-rule:nonzero;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 24.5 8 C 24.5 9.105469 23.605469 10 22.5 10 C 21.394531 10 20.5 9.105469 20.5 8 C 20.5 6.894531 21.394531 6 22.5 6 C 23.605469 6 24.5 6.894531 24.5 8 Z M 24.5 8 "></path><path style="fill-rule:nonzero;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 33 9 C 33 10.105469 32.105469 11 31 11 C 29.894531 11 29 10.105469 29 9 C 29 7.894531 29.894531 7 31 7 C 32.105469 7 33 7.894531 33 9 Z M 33 9 "></path><path style="fill-rule:nonzero;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 41 12 C 41 13.105469 40.105469 14 39 14 C 37.894531 14 37 13.105469 37 12 C 37 10.894531 37.894531 10 39 10 C 40.105469 10 41 10.894531 41 12 Z M 41 12 "></path></g>', 1);
const _hoisted_3$8 = [
  _hoisted_2$9
];
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 45 45",
    version: "1.1"
  }, _hoisted_3$8, 8, _hoisted_1$9);
}
var WhiteQueen = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a]]);
const _sfc_main$9 = {
  name: "WhiteRook",
  props: {
    size: Number
  }
};
const _hoisted_1$8 = ["width", "height"];
const _hoisted_2$8 = /* @__PURE__ */ createStaticVNode('<g id="surface1"><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 9 39.000781 L 36 39.000781 L 36 36.000781 L 9 36.000781 Z M 9 39.000781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12 36.000781 L 12 32.000781 L 33 32.000781 L 33 36.000781 Z M 12 36.000781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 11 14.000781 L 11 9.000781 L 15 9.000781 L 15 11.000781 L 20 11.000781 L 20 9.000781 L 25 9.000781 L 25 11.000781 L 30 11.000781 L 30 9.000781 L 34 9.000781 L 34 14.000781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 34 14.000781 L 31 17.000781 L 14 17.000781 L 11 14.000781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 31 17.000781 L 31 29.500781 L 14 29.500781 L 14 17.000781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 31 29.500781 L 32.5 32.000781 L 12.5 32.000781 L 14 29.500781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:miter;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 11 14.000781 L 34 14.000781 " transform="matrix(1,0,0,1,0,0.3)"></path></g>', 1);
const _hoisted_3$7 = [
  _hoisted_2$8
];
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 45 45",
    version: "1.1"
  }, _hoisted_3$7, 8, _hoisted_1$8);
}
var WhiteRook = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9]]);
const _sfc_main$8 = {
  name: "BlackBishop",
  props: {
    size: Number
  }
};
const _hoisted_1$7 = ["width", "height"];
const _hoisted_2$7 = /* @__PURE__ */ createStaticVNode('<g id="surface1"><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 9 36 C 12.390234 35.029687 19.109766 36.430078 22.5 33.999609 C 25.890234 36.430078 32.609766 35.029687 36 36 C 36 36 37.65 36.540234 39 38.000391 C 38.320312 38.969531 37.35 38.989453 36 38.499609 C 32.609766 37.530469 25.890234 38.960156 22.5 37.5 C 19.109766 38.960156 12.390234 37.530469 9 38.499609 C 7.65 38.989453 6.679688 38.969531 6 38.000391 C 7.35 36.540234 9 36 9 36 Z M 9 36 " transform="matrix(3.333333,0,0,3.333333,0,2)"></path><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 15 32.000391 C 17.499609 34.5 27.500391 34.5 30 32.000391 C 30.500391 30.500391 30 30 30 30 C 30 27.500391 27.500391 26.000391 27.500391 26.000391 C 33 24.500391 33.500391 14.499609 22.5 10.5 C 11.499609 14.499609 12 24.500391 17.499609 26.000391 C 17.499609 26.000391 15 27.500391 15 30 C 15 30 14.499609 30.500391 15 32.000391 Z M 15 32.000391 " transform="matrix(3.333333,0,0,3.333333,0,2)"></path><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 24.999609 8.000391 C 24.999609 9.380859 23.880469 10.5 22.5 10.5 C 21.119531 10.5 20.000391 9.380859 20.000391 8.000391 C 20.000391 6.61875 21.119531 5.499609 22.5 5.499609 C 23.880469 5.499609 24.999609 6.61875 24.999609 8.000391 Z M 24.999609 8.000391 " transform="matrix(3.333333,0,0,3.333333,0,2)"></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:miter;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 17.499609 26.000391 L 27.500391 26.000391 M 15 30 L 30 30 M 22.5 15.500391 L 22.5 20.499609 M 20.000391 18 L 24.999609 18 " transform="matrix(3.333333,0,0,3.333333,0,2)"></path></g>', 1);
const _hoisted_3$6 = [
  _hoisted_2$7
];
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 150 150",
    version: "1.1"
  }, _hoisted_3$6, 8, _hoisted_1$7);
}
var BlackBishop = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8]]);
const _sfc_main$7 = {
  name: "BlackKing",
  props: {
    size: Number
  }
};
const _hoisted_1$6 = ["width", "height"];
const _hoisted_2$6 = /* @__PURE__ */ createStaticVNode('<g id="surface1"><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:miter;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 22.5 11.628906 L 22.5 6 "></path><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 22.5 25 C 22.5 25 27 17.5 25.5 14.5 C 25.5 14.5 24.5 12 22.5 12 C 20.5 12 19.5 14.5 19.5 14.5 C 18 17.5 22.5 25 22.5 25 "></path><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12.5 37 C 18 40.5 27 40.5 32.5 37 L 32.5 30 C 32.5 30 41.5 25.5 38.5 19.5 C 34.5 13 25 16 22.5 23.5 L 22.5 27 L 22.5 23.5 C 20 16 10.5 13 6.5 19.5 C 3.5 25.5 12.5 30 12.5 30 L 12.5 37 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:miter;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 20 8 L 25 8 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 32 29.5 C 32 29.5 40.5 25.5 38.03125 19.851562 C 34.148438 14 25 18 22.5 24.5 L 22.5 26.601562 L 22.5 24.5 C 20 18 10.851562 14 6.96875 19.851562 C 4.5 25.5 13 29.5 13 29.5 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12.5 30 C 18 27 27 27 32.5 30 M 12.5 33.5 C 18 30.5 27 30.5 32.5 33.5 M 12.5 37 C 18 34 27 34 32.5 37 "></path></g>', 1);
const _hoisted_3$5 = [
  _hoisted_2$6
];
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 45 45",
    version: "1.1"
  }, _hoisted_3$5, 8, _hoisted_1$6);
}
var BlackKing = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7]]);
const _sfc_main$6 = {
  name: "BlackKnight",
  props: {
    size: Number
  }
};
const _hoisted_1$5 = ["width", "height"];
const _hoisted_2$5 = /* @__PURE__ */ createStaticVNode('<g id="surface1"><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 22 10.000781 C 32.5 11.000781 38.5 18.000781 38 39.000781 L 15 39.000781 C 15 30.000781 25 32.500781 23 18.000781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 24 18.000781 C 24.378906 20.910937 18.449219 25.371875 16 27.000781 C 13 29.000781 13.179688 31.340625 11 31.000781 C 9.957031 30.059375 12.410156 27.961719 11 28.000781 C 10 28.000781 11.191406 29.23125 10 30.000781 C 9 30.000781 5.996094 31.000781 6 26.000781 C 6 24.000781 12 14.000781 12 14.000781 C 12 14.000781 13.890625 12.098437 14 10.500781 C 13.269531 9.504687 13.5 8.500781 13.5 7.500781 C 14.5 6.500781 16.5 10.000781 16.5 10.000781 L 18.5 10.000781 C 18.5 10.000781 19.28125 8.008594 21 7.000781 C 22 7.000781 22 10.000781 22 10.000781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 9.5 25.500781 C 9.5 25.774219 9.277344 26.000781 9 26.000781 C 8.722656 26.000781 8.5 25.774219 8.5 25.500781 C 8.5 25.223437 8.722656 25.000781 9 25.000781 C 9.277344 25.000781 9.5 25.223437 9.5 25.500781 Z M 9.5 25.500781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 15.000905 15.50038 C 14.999749 16.326502 14.776004 17.001477 14.499328 16.998836 C 14.224605 16.999578 13.99872 16.327096 13.999876 15.500973 C 13.99908 14.671468 14.224777 13.999876 14.4995 13.999134 C 14.776176 14.001775 15.000108 14.670874 15.000905 15.50038 Z M 15.000905 15.50038 " transform="matrix(0.866,0.5,-0.5,0.866,9.693,-4.873)"></path><path style="stroke:none;fill-rule:evenodd;fill:rgb(100%, 100%, 100%);fill-opacity:1;" d="M 24.550781 10.699219 L 24.101562 12.148438 L 24.601562 12.300781 C 27.75 13.300781 30.25 14.789062 32.5 19.050781 C 34.75 23.308594 35.75 29.359375 35.25 39.300781 L 35.199219 39.800781 L 37.449219 39.800781 L 37.5 39.300781 C 38 29.238281 36.621094 22.449219 34.25 17.960938 C 31.878906 13.46875 28.460938 11.320312 25.058594 10.800781 Z M 24.550781 10.699219 "></path></g>', 1);
const _hoisted_3$4 = [
  _hoisted_2$5
];
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 45 45",
    version: "1.1"
  }, _hoisted_3$4, 8, _hoisted_1$5);
}
var BlackKnight = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
const _sfc_main$5 = {
  name: "BlackPawn",
  props: {
    size: Number
  }
};
const _hoisted_1$4 = ["width", "height"];
const _hoisted_2$4 = /* @__PURE__ */ createElementVNode("g", { id: "surface1" }, [
  /* @__PURE__ */ createElementVNode("path", {
    style: { "fill-rule": "nonzero", "fill": "rgb(0%, 0%, 0%)", "fill-opacity": "1", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "miter", "stroke": "rgb(0%, 0%, 0%)", "stroke-opacity": "1", "stroke-miterlimit": "4" },
    d: "M 22.5 9 C 20.289062 9 18.5 10.789062 18.5 13 C 18.5 13.890625 18.789062 14.710938 19.28125 15.378906 C 17.328125 16.5 16 18.589844 16 21 C 16 23.03125 16.941406 24.839844 18.410156 26.03125 C 15.410156 27.089844 11 31.578125 11 39.5 L 34 39.5 C 34 31.578125 29.589844 27.089844 26.589844 26.03125 C 28.058594 24.839844 29 23.03125 29 21 C 29 18.589844 27.671875 16.5 25.71875 15.378906 C 26.210938 14.710938 26.5 13.890625 26.5 13 C 26.5 10.789062 24.710938 9 22.5 9 Z M 22.5 9 "
  })
], -1);
const _hoisted_3$3 = [
  _hoisted_2$4
];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 45 45",
    version: "1.1"
  }, _hoisted_3$3, 8, _hoisted_1$4);
}
var BlackPawn = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
const _sfc_main$4 = {
  name: "BlackQueen",
  props: {
    size: Number
  }
};
const _hoisted_1$3 = ["width", "height"];
const _hoisted_2$3 = /* @__PURE__ */ createStaticVNode('<g id="surface1"><path style="fill-rule:nonzero;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 9 26 C 17.5 24.5 30 24.5 36 26 L 38.5 13.5 L 31 25 L 30.699219 10.898438 L 25.5 24.5 L 22.5 10 L 19.5 24.5 L 14.300781 10.898438 L 14 25 L 6.5 13.5 Z M 9 26 "></path><path style="fill-rule:nonzero;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 9 26 C 9 28 10.5 28 11.5 30 C 12.5 31.5 12.5 31 12 33.5 C 10.5 34.5 11 36 11 36 C 9.5 37.5 11 38.5 11 38.5 C 17.5 39.5 27.5 39.5 34 38.5 C 34 38.5 35.5 37.5 34 36 C 34 36 34.5 34.5 33 33.5 C 32.5 31 32.5 31.5 33.5 30 C 34.5 28 36 28 36 26 C 27.5 24.5 17.5 24.5 9 26 Z M 9 26 "></path><path style="fill-rule:nonzero;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 11.5 30 C 15 29 30 29 33.5 30 "></path><path style="fill-rule:nonzero;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12 33.5 C 18 32.5 27 32.5 33 33.5 "></path><path style="fill-rule:nonzero;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 8 12 C 8 13.105469 7.105469 14 6 14 C 4.894531 14 4 13.105469 4 12 C 4 10.894531 4.894531 10 6 10 C 7.105469 10 8 10.894531 8 12 Z M 8 12 "></path><path style="fill-rule:nonzero;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 16 9 C 16 10.105469 15.105469 11 14 11 C 12.894531 11 12 10.105469 12 9 C 12 7.894531 12.894531 7 14 7 C 15.105469 7 16 7.894531 16 9 Z M 16 9 "></path><path style="fill-rule:nonzero;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 24.5 8 C 24.5 9.105469 23.605469 10 22.5 10 C 21.394531 10 20.5 9.105469 20.5 8 C 20.5 6.894531 21.394531 6 22.5 6 C 23.605469 6 24.5 6.894531 24.5 8 Z M 24.5 8 "></path><path style="fill-rule:nonzero;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 33 9 C 33 10.105469 32.105469 11 31 11 C 29.894531 11 29 10.105469 29 9 C 29 7.894531 29.894531 7 31 7 C 32.105469 7 33 7.894531 33 9 Z M 33 9 "></path><path style="fill-rule:nonzero;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 41 12 C 41 13.105469 40.105469 14 39 14 C 37.894531 14 37 13.105469 37 12 C 37 10.894531 37.894531 10 39 10 C 40.105469 10 41 10.894531 41 12 Z M 41 12 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 11 38.5 C 18.449219 41.089844 26.550781 41.089844 34 38.5 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 11 29 C 18.449219 26.410156 26.550781 26.410156 34 29 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12.5 31.5 L 32.5 31.5 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 11.5 34.5 C 18.644531 36.863281 26.355469 36.863281 33.5 34.5 "></path><path style="fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 10.5 37.5 C 18.25 40.328125 26.75 40.328125 34.5 37.5 "></path></g>', 1);
const _hoisted_3$2 = [
  _hoisted_2$3
];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 45 45",
    version: "1.1"
  }, _hoisted_3$2, 8, _hoisted_1$3);
}
var BlackQueen = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
const _sfc_main$3 = {
  name: "BlackRook",
  props: {
    size: Number
  }
};
const _hoisted_1$2 = ["width", "height"];
const _hoisted_2$2 = /* @__PURE__ */ createStaticVNode('<g id="surface1"><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 9 39.000781 L 36 39.000781 L 36 36.000781 L 9 36.000781 Z M 9 39.000781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12.5 32.000781 L 14 29.500781 L 31 29.500781 L 32.5 32.000781 Z M 12.5 32.000781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12 36.000781 L 12 32.000781 L 33 32.000781 L 33 36.000781 Z M 12 36.000781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 14 29.500781 L 14 16.500781 L 31 16.500781 L 31 29.500781 Z M 14 29.500781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 14 16.500781 L 11 14.000781 L 34 14.000781 L 31 16.500781 Z M 14 16.500781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill-rule:evenodd;fill:rgb(0%, 0%, 0%);fill-opacity:1;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(0%, 0%, 0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 11 14.000781 L 11 9.000781 L 15 9.000781 L 15 11.000781 L 20 11.000781 L 20 9.000781 L 25 9.000781 L 25 11.000781 L 30 11.000781 L 30 9.000781 L 34 9.000781 L 34 14.000781 Z M 11 14.000781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:miter;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12 35.500781 L 33 35.500781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:miter;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 13 31.500781 L 32 31.500781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:miter;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 14 29.500781 L 31 29.500781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:miter;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 14 16.500781 L 31 16.500781 " transform="matrix(1,0,0,1,0,0.3)"></path><path style="fill:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:miter;stroke:rgb(100%, 100%, 100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 11 14.000781 L 34 14.000781 " transform="matrix(1,0,0,1,0,0.3)"></path></g>', 1);
const _hoisted_3$1 = [
  _hoisted_2$2
];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 45 45",
    version: "1.1"
  }, _hoisted_3$1, 8, _hoisted_1$2);
}
var BlackRook = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = {
  name: "ChessPiece",
  components: {
    WhiteBishop,
    WhiteKing,
    WhiteKnight,
    WhitePawn,
    WhiteQueen,
    WhiteRook,
    BlackBishop,
    BlackKing,
    BlackKnight,
    BlackPawn,
    BlackQueen,
    BlackRook
  },
  props: ["piece", "size"],
  computed: {
    pieceName() {
      return this.piece.color + "/" + this.piece.pieceName;
    },
    pieceSize() {
      return this.size * 0.11;
    }
  }
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_white_bishop = resolveComponent("white-bishop");
  const _component_white_king = resolveComponent("white-king");
  const _component_white_knight = resolveComponent("white-knight");
  const _component_white_pawn = resolveComponent("white-pawn");
  const _component_white_queen = resolveComponent("white-queen");
  const _component_white_rook = resolveComponent("white-rook");
  const _component_black_bishop = resolveComponent("black-bishop");
  const _component_black_king = resolveComponent("black-king");
  const _component_black_knight = resolveComponent("black-knight");
  const _component_black_pawn = resolveComponent("black-pawn");
  const _component_black_queen = resolveComponent("black-queen");
  const _component_black_rook = resolveComponent("black-rook");
  return $options.pieceName === "white/bishop" ? (openBlock(), createBlock(_component_white_bishop, {
    key: 0,
    size: $options.pieceSize
  }, null, 8, ["size"])) : $options.pieceName === "white/king" ? (openBlock(), createBlock(_component_white_king, {
    key: 1,
    size: $options.pieceSize
  }, null, 8, ["size"])) : $options.pieceName === "white/knight" ? (openBlock(), createBlock(_component_white_knight, {
    key: 2,
    size: $options.pieceSize
  }, null, 8, ["size"])) : $options.pieceName === "white/pawn" ? (openBlock(), createBlock(_component_white_pawn, {
    key: 3,
    size: $options.pieceSize
  }, null, 8, ["size"])) : $options.pieceName === "white/queen" ? (openBlock(), createBlock(_component_white_queen, {
    key: 4,
    size: $options.pieceSize
  }, null, 8, ["size"])) : $options.pieceName === "white/rook" ? (openBlock(), createBlock(_component_white_rook, {
    key: 5,
    size: $options.pieceSize
  }, null, 8, ["size"])) : $options.pieceName === "black/bishop" ? (openBlock(), createBlock(_component_black_bishop, {
    key: 6,
    size: $options.pieceSize
  }, null, 8, ["size"])) : $options.pieceName === "black/king" ? (openBlock(), createBlock(_component_black_king, {
    key: 7,
    size: $options.pieceSize
  }, null, 8, ["size"])) : $options.pieceName === "black/knight" ? (openBlock(), createBlock(_component_black_knight, {
    key: 8,
    size: $options.pieceSize
  }, null, 8, ["size"])) : $options.pieceName === "black/pawn" ? (openBlock(), createBlock(_component_black_pawn, {
    key: 9,
    size: $options.pieceSize
  }, null, 8, ["size"])) : $options.pieceName === "black/queen" ? (openBlock(), createBlock(_component_black_queen, {
    key: 10,
    size: $options.pieceSize
  }, null, 8, ["size"])) : $options.pieceName === "black/rook" ? (openBlock(), createBlock(_component_black_rook, {
    key: 11,
    size: $options.pieceSize
  }, null, 8, ["size"])) : createCommentVNode("", true);
}
var ChessPiece = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
var BoardGround_vue_vue_type_style_index_0_lang = "";
const _sfc_main$1 = {
  name: "Board",
  data() {
    return {
      render: false
    };
  },
  props: {
    size: Number,
    game: Object,
    isActivePiece: Function,
    orientation: String
  },
  emits: ["selectPiece", "isActivePiece"],
  watch: {
    "game.fen": {
      handler() {
        this.render = !this.render;
      }
    }
  },
  methods: {
    getPiece(x, y) {
      if (this.orientation === "black")
        return this.game.getPiece(9 - x, 9 - y);
      return this.game.getPiece(x, y);
    }
  },
  components: { ChessPiece }
};
const _hoisted_1$1 = { class: "vc-board-ground" };
const _hoisted_2$1 = ["onClick"];
const _hoisted_3 = { class: "vc-board-positions" };
const _hoisted_4 = { class: "vc-board-positions vc-letter" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_chess_piece = resolveComponent("chess-piece");
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    (openBlock(), createElementBlock(Fragment, null, renderList(8, (y) => {
      return openBlock(), createElementBlock(Fragment, null, [
        (openBlock(), createElementBlock(Fragment, null, renderList(8, (x) => {
          return createElementVNode("div", {
            key: y * x,
            class: normalizeClass(["vc-square", x % 2 === y % 2 ? "vc-light-square" : "vc-dark-square"])
          }, [
            $options.getPiece(x, y) ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass($props.isActivePiece($options.getPiece(x, y)) ? "vc-piece vc-active-piece" : "vc-piece"),
              onClick: ($event) => _ctx.$emit("selectPiece", $options.getPiece(x, y))
            }, [
              createVNode(_component_chess_piece, {
                size: $props.size,
                piece: $options.getPiece(x, y)
              }, null, 8, ["size", "piece"])
            ], 10, _hoisted_2$1)) : createCommentVNode("", true)
          ], 2);
        }), 64))
      ], 64);
    }), 64)),
    createElementVNode("div", _hoisted_3, [
      (openBlock(), createElementBlock(Fragment, null, renderList(8, (i) => {
        return createElementVNode("div", {
          key: i,
          class: normalizeClass(["vc-number vc-no-select", i % 2 === 1 ? "vc-dark" : "vc-light"]),
          style: normalizeStyle({ fontSize: `${$props.size * 0.02}px` })
        }, toDisplayString($props.orientation === "black" ? i : 9 - i), 7);
      }), 64))
    ]),
    createElementVNode("div", _hoisted_4, [
      (openBlock(), createElementBlock(Fragment, null, renderList(8, (i) => {
        return createElementVNode("div", {
          key: i,
          class: normalizeClass(["vc-letters vc-no-select", i % 2 === 0 ? "vc-dark" : "vc-light"]),
          style: normalizeStyle({ fontSize: `${$props.size * 0.02}px` })
        }, toDisplayString($props.orientation === "black" ? String.fromCharCode(96 + (9 - i)) : String.fromCharCode(96 + i)), 7);
      }), 64))
    ])
  ]);
}
var BoardGround = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
var ChessBoard_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {
  name: "ChessBoard",
  data() {
    return {
      defaultGame: new ChessGame(),
      validMoves: [],
      selectedPiece: null,
      render: false
    };
  },
  props: {
    fen: {
      type: String,
      default: DEFAULT_FEN$1
    },
    size: {
      type: Number,
      default: 800
    },
    game: {
      type: Object
    },
    disableWhiteMoves: {
      type: Boolean,
      default: false
    },
    disableBlackMoves: {
      type: Boolean,
      default: false
    },
    orientation: {
      type: String,
      default: "white"
    }
  },
  emits: ["onMovePlayed", "onGameOver", "update:fen"],
  components: {
    BoardGround
  },
  computed: {
    chessGame() {
      return this.game || this.defaultGame;
    }
  },
  watch: {
    fen(newFEN) {
      if (this.chessGame.fen !== newFEN)
        this.chessGame.loadGameWithFen(newFEN || DEFAULT_FEN$1);
    },
    "chessGame.fen": {
      handler(newFen) {
        this.$emit("update:fen", newFen);
        if (this.chessGame.gameOver)
          this.$emit("onGameOver", {
            winner: this.chessGame.winner,
            game: this.chessGame
          });
      }
    },
    game() {
      this.selectedPiece = null;
      this.validMoves = [];
      this.defaultGame = new ChessGame();
    }
  },
  created() {
    this.chessGame.loadGameWithFen(this.fen || DEFAULT_FEN$1);
  },
  methods: {
    isActivePiece(piece) {
      if (this.chessGame.gameOver)
        return false;
      if (this.disableWhiteMoves && this.chessGame.currentPlayer === WHITE$1)
        return false;
      if (this.disableBlackMoves && this.chessGame.currentPlayer === BLACK$1)
        return false;
      return piece && piece.color === this.chessGame.currentPlayer;
    },
    selectPiece(piece) {
      if (!this.isActivePiece(piece) || this.chessGame.gameOver)
        return;
      this.selectedPiece = piece;
      this.validMoves = this.chessGame.getPieceMoves(piece);
    },
    makeMove(move) {
      this.validMoves = [];
      this.selectedPiece = null;
      this.$emit("onMovePlayed", { move, game: this.chessGame });
    },
    getMoveStyle(move) {
      if (move.promotion && move.promotion !== "q")
        return { display: "none" };
      let { x, y } = move.targetPosition;
      if (this.orientation === "black") {
        x = 7 - x;
        y = 7 - y;
      }
      return {
        transform: `translate(${x * 100}%,${y * 100}% `
      };
    }
  }
};
const _hoisted_1 = { class: "vc-board-positions vc-valid-moves" };
const _hoisted_2 = ["onClick"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_board_ground = resolveComponent("board-ground");
  return openBlock(), createElementBlock("div", null, [
    createElementVNode("div", {
      class: "vc-board",
      style: normalizeStyle({ width: `${$props.size}px`, height: `${$props.size}px` })
    }, [
      createVNode(_component_board_ground, {
        game: $options.chessGame,
        size: $props.size,
        onSelectPiece: $options.selectPiece,
        isActivePiece: $options.isActivePiece,
        orientation: $props.orientation
      }, null, 8, ["game", "size", "onSelectPiece", "isActivePiece", "orientation"]),
      createElementVNode("div", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($data.validMoves, (move, index) => {
          return openBlock(), createElementBlock("div", {
            key: index,
            class: "vc-valid-move",
            style: normalizeStyle($options.getMoveStyle(move)),
            onClick: ($event) => $options.makeMove(move)
          }, null, 12, _hoisted_2);
        }), 128))
      ])
    ], 4)
  ]);
}
var ChessBoard = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ChessAI, ChessBoard, ChessGame };
