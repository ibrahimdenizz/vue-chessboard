import {
  pieceCode,
  pieceCodeToMoveOffsets,
  pieceCodeToName,
  WHITE,
} from "@/constants/chess";

class Piece {
  index = 0;
  color = WHITE;
  imgUrl = "";
  imgAlt = "";
  code = "";
  isSlide = false;

  constructor({ index, color, code }) {
    this.index = index;
    this.color = color;
    this.code = code;
    this.setIsSlide(code);
    this.imgUrl = `/chess-pieces/${this.color}/${this.pieceName}.svg`;
    this.imgAlt = `${this.color} ${this.pieceName}`;
  }

  changePieceType(code) {
    this.code = code;
    this.setIsSlide(code);
    this.imgUrl = `/chess-pieces/${this.color}/${this.pieceName}.svg`;
    this.imgAlt = `${this.color} ${this.pieceName}`;
  }

  get type() {
    return this.code.toLowerCase();
  }

  get position() {
    return {
      x: this.index % 8,
      y: parseInt(this.index / 8),
    };
  }

  get pieceName() {
    return pieceCodeToName[this.type];
  }

  get moveOffsets() {
    if (this.type === pieceCode.pawn)
      return pieceCodeToMoveOffsets[this.type][this.color];

    return pieceCodeToMoveOffsets[this.type];
  }

  get copy() {
    return new Piece({ index: this.index, color: this.color, code: this.code });
  }

  setIsSlide(value) {
    value = value.toLowerCase();
    this.isSlide =
      value === pieceCode.bishop ||
      value === pieceCode.queen ||
      value === pieceCode.rook;
  }

  equals(piece) {
    console.log(piece.index, this.index);
    return piece.index === this.index;
  }
}

export default Piece;
