import { BLACK, WHITE, Coefficients } from "@/constants/chess";

export default class ChessAI {
  bestMove = {
    evaluation: 0,
    move: null,
  };

  constructor({ type = "normal", depth = 1, game = null }) {
    this.type = type;
    this.depth = depth;
    this.game = game;
  }

  selectMove(_game) {
    const game = this.game || _game;
    if (this.type === "random") return this.selectRandomMove(game.moves);
    if (this.type === "normal") {
      this.search(
        this.depth,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        game
      );

      return this.bestMove.move;
    }
  }

  selectRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  search(depth, alpha, beta, _game) {
    const game = this.game || _game;
    if (depth === 0) {
      return this.evaluate(_game);
    }

    console.log(this.evaluate(_game));

    if (game.moves.length === 0) {
      if (game.inCheck()) {
        return Number.NEGATIVE_INFINITY;
      }
      return 0;
    }

    for (const move of game.moves) {
      game.makeMove(move);
      let evaluation = -this.search(depth - 1, alpha, beta, _game);
      game.undoMove();

      if (evaluation >= beta) {
        return beta;
      }

      if (alpha < evaluation) {
        alpha = evaluation;
        this.saveBestMove(move, evaluation);
      }
    }

    return alpha;
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
