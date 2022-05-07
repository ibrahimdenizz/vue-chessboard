export const DEFAULT_FEN =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  WHITE = "white",
  BLACK = "black",
  K_SIDE_CASTLE = 2,
  Q_SIDE_CASTLE = 1,
  BOTH_SIDE_CASTLE = 3;

export const rookSides = {
  black: { k: 7, q: 0 },
  white: {
    k: 63,
    q: 56,
  },
};

export const pieceNameToCode = {
  black: {
    king: "k",
    queen: "q",
    bishop: "b",
    knight: "n",
    pawn: "p",
    rook: "r",
  },
  white: {
    king: "K",
    queen: "Q",
    bishop: "B",
    knight: "N",
    pawn: "P",
    rook: "R",
  },
};

export const pieceCode = {
  king: "k",
  queen: "q",
  bishop: "b",
  knight: "n",
  pawn: "p",
  rook: "r",
};

export const pieceCodeToName = {
  k: "king",
  q: "queen",
  b: "bishop",
  n: "knight",
  p: "pawn",
  r: "rook",
};

export const pieceCodeToMoveOffsets = {
  k: [1, 7, -8, 9, 1, -7, -8, -9],
  q: [1, 7, -8, 9, 1, -7, -8, -9],
  b: [7, 9, -7, -9],
  n: [6, 10, 15, 17, -6, -10, -15, -17],
  p: { [WHITE]: [-8, -16, -7, -9], [BLACK]: [8, 16, 7, 9] },
  r: [1, 8, -1, -8],
};

export const pieceCodeToCaptureOffsets = {
  k: [1, 7, -8, 9, 1, -7, -8, -9],
  q: [1, 7, -8, 9, 1, -7, -8, -9],
  b: [7, 9, -7, -9],
  n: [6, 10, 15, 17, -6, -10, -15, -17],
  p: { [WHITE]: [-7, -9], [BLACK]: [7, 9] },
  r: [1, 8, -1, -8],
};

/* 10x12 Board move generation constants */

export const mailboxOutside = -1;

// prettier-ignore
export const mailbox = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1,  0,  1,  2,  3,  4,  5,  6,  7, -1,
  -1,  8,  9, 10, 11, 12, 13, 14, 15, -1,
  -1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
  -1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
  -1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
  -1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
  -1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
  -1, 56, 57, 58, 59, 60, 61, 62, 63, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
];

// prettier-ignore
export const mailbox64 = [
 21, 22, 23, 24, 25, 26, 27, 28,
 31, 32, 33, 34, 35, 36, 37, 38,
 41, 42, 43, 44, 45, 46, 47, 48,
 51, 52, 53, 54, 55, 56, 57, 58,
 61, 62, 63, 64, 65, 66, 67, 68,
 71, 72, 73, 74, 75, 76, 77, 78,
 81, 82, 83, 84, 85, 86, 87, 88,
 91, 92, 93, 94, 95, 96, 97, 98
];

export const mailboxOffsets = {
  n: [-21, -19, -12, -8, 8, 12, 19, 21] /* KNIGHT */,
  b: [-11, -9, 9, 11] /* BISHOP */,
  r: [-10, -1, 1, 10] /* ROOK */,
  q: [-11, -10, -9, -1, 1, 9, 10, 11] /* QUEEN */,
  k: [-11, -10, -9, -1, 1, 9, 10, 11] /* KING */,
  p: {
    [WHITE]: [-11, -9],
    [BLACK]: [9, 11],
  } /* KING */,
};
