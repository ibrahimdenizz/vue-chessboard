export default class ChessAI {
  constructor({ type = "random", depth = 0 }) {
    this.type = type;
    this.depth = depth;
  }

  selectMove(game) {
    if (this.type === "random") return this.selectRandomMove(game.moves);
  }

  selectRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  moveGenerationTest(depth, game) {
    if (depth === 1) return game.moves.length;

    let totalMove = 0;
    for (const move of game.moves) {
      game.makeMove(move);
      totalMove += this.moveGenerationTest(depth - 1, game);
      game.undoMove();
    }

    return totalMove;
  }
}
