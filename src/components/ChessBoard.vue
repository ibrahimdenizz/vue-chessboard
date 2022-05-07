<script>
import { ChessGame } from "@/services/chess";
import BoardGround from "./BoardGround.vue";

export default {
  name: "ChessBoard",
  data() {
    return {
      game: new ChessGame(),
      validMoves: [],
      selectedPiece: null,
    };
  },
  props: {
    fen: String,
    size: Number,
  },
  emits: ["update:fen"],
  components: {
    BoardGround,
  },
  watch: {
    fen(newFEN) {
      this.game.fen = newFEN;
    },
  },
  created() {
    this.game.loadGameWithFen(this.fen);
  },
  methods: {
    isActivePiece(piece) {
      return piece && piece.color === this.game.currentPlayer;
    },
    selectPiece(piece) {
      if (!this.isActivePiece(piece)) return;
      this.selectedPiece = piece;
      this.validMoves = this.game.getPieceMoves(piece);
      console.log(this.validMoves);
    },
    makeMove(move) {
      this.game.makeMove(move);
      this.validMoves = [];
      this.selectedPiece = null;
      this.$emit("update:fen", this.game.fen);
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
      @isActivePiece="isActivePiece"
    />

    <div class="board-positions valid-moves">
      <div
        v-for="(move, index) in validMoves"
        :key="index"
        class="valid-move"
        :class="
          move.targetPosition.x % 2 === move.targetPosition.y % 2
            ? 'light'
            : 'dark'
        "
        :style="{
          transform: `translate(${move.targetPosition.x * 100}%,${
            move.targetPosition.y * 100
          }% `,
        }"
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

  .piece {
    z-index: 100;
    width: 12.5%;
    height: 12.5%;
    position: absolute;
  }

  .valid-move {
    z-index: 100;
    width: 12.5%;
    height: 12.5%;
    position: absolute;
    background-color: blue;
    opacity: 0.2;
  }

  .active-piece {
    cursor: pointer;
  }

  &.positions {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
