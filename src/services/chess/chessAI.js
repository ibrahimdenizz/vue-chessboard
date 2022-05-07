export default class ChessAI {
  constructor({ type = "random" }) {
    this.type = type;
  }

  selectMove(moves) {
    if (this.type === "random") return this.selectRandomMove(moves);
  }

  selectRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  }
}
