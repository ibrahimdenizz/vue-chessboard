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

      return {
        transform: `translate(${move.targetPosition.x * 100}%,${
          move.targetPosition.y * 100
        }% `,
      };
    },
  },
};
</script>

<template>
  <div>
    <div class="board" :style="{ width: `${size}px`, height: `${size}px` }">
      <board-ground
        :game="chessGame"
        :size="size"
        @selectPiece="selectPiece"
        :isActivePiece="isActivePiece"
      />

      <div class="board-positions valid-moves">
        <div
          v-for="(move, index) in validMoves"
          :key="index"
          class="valid-move"
          :style="getMoveStyle(move)"
          @click="makeMove(move)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$dark-color: #b58863;
$light-color: #f0d9b5;

.board {
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.board-positions {
  position: absolute;
  width: 100%;
  height: 100%;

  .valid-move {
    z-index: 100;
    width: 12.5%;
    height: 12.5%;
    position: absolute;
    background-color: blue;
    opacity: 0.2;
    cursor: pointer;
  }
}
</style>
