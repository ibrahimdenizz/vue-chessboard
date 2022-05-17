import { BLACK, DEFAULT_FEN, pieceCode, WHITE } from "@/constants/chess";
import Piece from "./pieces";

export default class Board {
  squares = Array(64).fill(null);
  validMoves = [];
  kings = {
    [WHITE]: null,
    [BLACK]: null,
  };

  constructor(fen) {
    this.fenPosition = fen || DEFAULT_FEN.split(" ")[0];
  }

  set fenPosition(fenPosition) {
    this.squares = Array(64).fill(null);
    fenPosition.split("/").forEach((rowStr, y) => {
      let x = 0;
      rowStr.split("").forEach((char) => {
        if (parseInt(char)) {
          x += parseInt(char);
        } else {
          const pieceParam = {
            index: y * 8 + x,
            code: char,
            color: char !== char.toLowerCase() ? WHITE : BLACK,
          };
          const piece = new Piece(pieceParam);
          this.squares[y * 8 + x] = piece;
          if (piece.type === pieceCode.king) {
            this.kings[piece.color] = piece;
          }
          x++;
        }
      });
    });
  }

  getPiece(x, y = null) {
    if (y) return this.squares[(y - 1) * 8 + (x - 1)];
    else return this.squares[x];
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

  get pieceCount() {
    return this.squares.filter((x) => x).length;
  }
}
