import { moveOffsets, pieceCharToString } from "@/constants/pieces";
import fenToBoardArr from "./fenToBoardArr";

export default function calculateValidMoves(position, fen) {
  const board = fenToBoardArr(fen);
  console.log(board[position.y][position.x], position);
  const piece = pieceCharToString[board[position.y][position.x]];
  const [pieceColor, pieceType] = piece.split("/");

  if (pieceType === "pawn") {
    return getPawnMoves({ position, pieceColor, board });
  } else {
    const isOnlyOne = pieceType === "king" || pieceType === "knight";
    return getPieceMoves({
      position,
      pieceColor,
      pieceType,
      board,
      onlyOne: isOnlyOne,
    });
  }
}

function getPieceMoves({ position, pieceColor, pieceType, board, onlyOne }) {
  const legalMoves = [];
  const offsets = moveOffsets[pieceType];
  for (const offset of offsets) {
    const currentPosition = { ...position };
    currentPosition.x += offset.x;
    currentPosition.y += offset.y;
    while (
      isPositionValid(currentPosition) &&
      !board[currentPosition.y][currentPosition.x]
    ) {
      legalMoves.push({ ...currentPosition });
      if (onlyOne) break;
      currentPosition.x += offset.x;
      currentPosition.y += offset.y;
    }

    if (
      isPositionValid(currentPosition) &&
      board[currentPosition.y][currentPosition.x]
    ) {
      const capturePiece =
        pieceCharToString[board[currentPosition.y][currentPosition.x]];
      const [captureColor] = capturePiece.split("/");
      if (pieceColor !== captureColor) {
        legalMoves.push({ ...currentPosition });
      }
    }
  }

  return legalMoves;
}

function getPawnMoves({ position, pieceColor, board }) {
  const legalMoves = [];
  const validMoves = moveOffsets["pawn"][pieceColor].map(({ x, y }) => ({
    x: position.x + x,
    y: position.y + y,
  }));
  const firstRow = pieceColor === "white" ? 6 : 1;

  if (!board[validMoves[0].y][validMoves[0].x]) {
    legalMoves.push({
      x: validMoves[0].x,
      y: validMoves[0].y,
    });
    if (position.y === firstRow && !board[validMoves[1].y][validMoves[1].x])
      legalMoves.push({
        x: validMoves[1].x,
        y: validMoves[1].y,
      });
  }
  if (board[validMoves[2].y][validMoves[2].x])
    legalMoves.push({
      x: validMoves[2].x,
      y: validMoves[2].y,
    });

  if (board[validMoves[3].y][validMoves[3].x])
    legalMoves.push({
      x: validMoves[3].x,
      y: validMoves[3].y,
    });
  return legalMoves;
}

function isPositionValid(position) {
  return position.x > -1 && position.x < 8 && position.y > -1 && position.y < 8;
}
