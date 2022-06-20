<script>
import { BLACK, DEFAULT_FEN, WHITE } from "@/constants/chess";
import { ChessGame } from "@ibrahimdeniz/chess-js";
import BoardGround from "./BoardGround.vue";

export default {
  name: "ChessBoard",
  data() {
    return {
      defaultGame: new ChessGame(),
      validMoves: [],
      selectedPiece: null,
      render: false,
    };
  },
  props: {
    fen: {
      type: String,
      default: DEFAULT_FEN,
    },
    size: {
      type: Number,
      default: 800,
    },
    game: {
      type: Object,
    },
    disableWhiteMoves: {
      type: Boolean,
      default: false,
    },
    disableBlackMoves: {
      type: Boolean,
      default: false,
    },
    orientation: {
      type: String,
      default: "white",
    },
  },
  emits: ["onMovePlayed", "onGameOver", "update:fen"],
  components: {
    BoardGround,
  },
  computed: {
    chessGame() {
      return this.game || this.defaultGame;
    },
  },
  watch: {
    fen(newFEN) {
      if (this.chessGame.fen !== newFEN)
        this.chessGame.loadGameWithFen(newFEN || DEFAULT_FEN);
    },
    "chessGame.fen": {
      handler(newFen) {
        this.$emit("update:fen", newFen);
        if (this.chessGame.gameOver)
          this.$emit("onGameOver", {
            winner: this.chessGame.winner,
            game: this.chessGame,
          });
      },
    },
    game() {
      this.selectedPiece = null;
      this.validMoves = [];
      this.defaultGame = new ChessGame();
    },
  },
  created() {
    this.chessGame.loadGameWithFen(this.fen || DEFAULT_FEN);
  },
  methods: {
    isActivePiece(piece) {
      if (this.chessGame.gameOver) return false;
      if (this.disableWhiteMoves && this.chessGame.currentPlayer === WHITE)
        return false;
      if (this.disableBlackMoves && this.chessGame.currentPlayer === BLACK)
        return false;
      return piece && piece.color === this.chessGame.currentPlayer;
    },
    selectPiece(piece) {
      if (!this.isActivePiece(piece) || this.chessGame.gameOver) return;
      this.selectedPiece = piece;
      this.validMoves = this.chessGame.getPieceMoves(piece);
    },
    makeMove(move) {
      this.validMoves = [];
      this.selectedPiece = null;
      this.$emit("onMovePlayed", { move, game: this.chessGame });
    },
    getMoveStyle(move) {
      if (move.promotion && move.promotion !== "q") return { display: "none" };
      let { x, y } = move.targetPosition;
      if (this.orientation === "black") {
        x = 7 - x;
        y = 7 - y;
      }
      return {
        transform: `translate(${x * 100}%,${y * 100}% `,
      };
    },
  },
};
</script>

<template>
  <div>
    <div class="vc-board" :style="{ width: `${size}px`, height: `${size}px` }">
      <board-ground
        :game="chessGame"
        :size="size"
        @selectPiece="selectPiece"
        :isActivePiece="isActivePiece"
        :orientation="orientation"
      />

      <div class="vc-board-positions vc-valid-moves">
        <div
          v-for="(move, index) in validMoves"
          :key="index"
          class="vc-valid-move"
          :style="getMoveStyle(move)"
          @click="makeMove(move)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --vc-light-color: #b58863;
  --vc-dark-color: #f0d9b5;
  --vc-move-color: blue;
}

$light-color: var(--vc-light-color);
$dark-color: var(--vc-dark-color);
$move-color: var(--vc-move-color);

.vc-board {
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.vc-board-positions {
  position: absolute;
  width: 100%;
  height: 100%;

  .vc-valid-move {
    z-index: 100;
    width: 12.5%;
    height: 12.5%;
    position: absolute;
    background-color: $move-color;
    opacity: 0.2;
    cursor: pointer;
  }
}
</style>
