<script>
import { BLACK, DEFAULT_FEN, WHITE } from "@/constants/chess";
import { ChessGame } from "@/services/chess";
import BoardGround from "./BoardGround.vue";

export default {
  name: "ChessBoard",
  data() {
    return {
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
      type: ChessGame,
      default: new ChessGame(),
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
  emits: ["onMovePlayed", "onGameOver"],
  components: {
    BoardGround,
  },
  watch: {
    "game.fen": {
      handler(newFen) {
        if (this.game.gameOver)
          this.$emit("onGameOver", {
            winner: this.game.winner,
            game: this.game,
          });
      },
    },
    game() {
      this.selectedPiece = null;
      this.validMoves = [];
    },
  },
  created() {
    console.log("fen", this.fen);
    this.game.loadGameWithFen(this.fen || DEFAULT_FEN);
  },
  methods: {
    isActivePiece(piece) {
      if (this.disableWhiteMoves && this.game.currentPlayer === WHITE)
        return false;
      if (this.disableBlackMoves && this.game.currentPlayer === BLACK)
        return false;
      return piece && piece.color === this.game.currentPlayer;
    },
    selectPiece(piece) {
      if (!this.isActivePiece(piece)) return;
      this.selectedPiece = piece;
      this.validMoves = this.game.getPieceMoves(piece);
      // console.log(this.validMoves);
    },
    makeMove(move) {
      this.validMoves = [];
      this.selectedPiece = null;
      this.$emit("onMovePlayed", { move, game: this.game });
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
  <div class="board" :style="{ width: `${size}px`, height: `${size}px` }">
    <board-ground
      :game="game"
      :size="size"
      :fen="fen"
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
