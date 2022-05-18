import { BLACK, WHITE, Coefficients } from "@/constants/chess";

export default class ChessAI {
  bestMove = {
    evaluation: 0,
    move: null,
  };

  positionCount = 0;
  cutOff = 0;

  constructor({ type = "normal", depth = 1, game = null }) {
    this.type = type;
    this.depth = depth;
    this.game = game;
  }

  selectMove(_game) {
    const game = this.game || _game;
    if (this.type === "random") return this.selectRandomMove(game.moves);
    if (this.type === "normal") {
      this.positionCount = 0;
      const result = this.search(
        this.depth,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        game
      );
      console.log("searched position: ", this.positionCount, this.cutOff);
      return result[1];
    }
  }

  selectRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  search(depth, alpha, beta, game) {
    if (depth === 0) {
      this.positionCount++;
      return [this.evaluate(game), null];
    }

    game.buildMoves();

    if (game.moves.length === 0) {
      if (game.inCheck()) {
        return [Number.NEGATIVE_INFINITY, null];
      }
      return [0, null];
    }

    let bestMove;
    game.moves.sort((a, b) => b.score - a.score);
    for (const move of game.moves) {
      game.makeUglyMove(move);
      let [evaluation, _] = this.search(depth - 1, -beta, -alpha, game);
      evaluation = -evaluation;
      game.undoMove();

      if (evaluation >= beta) {
        this.cutOff++;
        return [beta, move];
      }

      if (evaluation > alpha) {
        alpha = evaluation;
        bestMove = move;
      }
    }

    return [alpha, bestMove];
  }

  saveBestMove(move, evaluation) {
    this.bestMove.move = move;
    this.bestMove.evaluation = evaluation;
  }

  evaluate(_game) {
    const game = this.game || _game;
    const board = game.board64Arr;
    const colorsEval = this.getColorsEval(board);

    const material = colorsEval[WHITE] - colorsEval[BLACK];

    return material * Coefficients[game.currentPlayer];
  }

  getColorsEval(board) {
    const colorsEval = {
      [WHITE]: 0,
      [BLACK]: 0,
    };

    for (const piece of board) {
      if (piece) {
        colorsEval[piece.color] += Coefficients[piece.type];
      }
    }

    return colorsEval;
  }
}
