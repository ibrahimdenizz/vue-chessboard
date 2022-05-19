import { BLACK, WHITE, Coefficients } from "@/constants/chess";

export default class ChessAI {
  positionCount = 0;
  cutOff = 0;
  quiesceCount = 0;

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
      this.quiesceCount = 0;
      this.cutOff = 0;
      const result = this.search(
        this.depth,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        game
      );
      console.log("searched position: ", this.positionCount);
      console.log("cut off count: ", this.cutOff);
      console.log("quiesce count: ", this.quiesceCount);
      return result[1];
    }
  }

  selectRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  search(depth, alpha, beta, game) {
    if (depth === 0) {
      this.positionCount++;
      return [this.quiesce(alpha, beta, game), null];
    }

    const moves = game.generateMoves();

    if (moves.length === 0) {
      if (game.inCheck()) {
        return [Number.NEGATIVE_INFINITY, null];
      }
      return [0, null];
    }

    let bestMove;
    moves.sort((a, b) => b.score - a.score);
    for (const move of moves) {
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

  quiesce(alpha, beta, game) {
    this.quiesceCount++;
    const stand_pat = this.evaluate(game);

    if (stand_pat >= beta) return beta;

    if (alpha < stand_pat) alpha = stand_pat;

    const captureMoves = game.generateMoves({ onlyCapture: true });
    captureMoves.sort((a, b) => b.score - a.score);

    for (const move of captureMoves) {
      game.makeUglyMove(move);
      const score = -this.quiesce(-beta, -alpha, game);
      game.undoMove();

      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
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
