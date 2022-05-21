<!-- 
  This file is just for testing library. 
  Actual library files exported in index.js.
  You can find actual files şf you follow index.js imports.
 -->

<template>
  <p
    :style="{
      'text-align': 'center',
    }"
  >
    Winner: {{ winner }}
  </p>
  <p
    :style="{
      'text-align': 'center',
    }"
  >
    FEN: {{ game.fen }}
  </p>
  <p
    :style="{
      'text-align': 'center',
    }"
  >
    Zobrist Hash: {{ game.zobrist.hash }}
  </p>
  <div class="home">
    <chess-board
      :game="game"
      v-model:fen="fen"
      @onMovePlayed="onMovePlayed"
      @onGameOver="onGameOver"
    />
    <div>
      <button class="btn" @click="undoMove()">Undo</button>
      <button class="btn" @click="changeGameType('two-player')">
        Two player
      </button>
      <button class="btn" @click="changeGameType('random-ai')">
        Random AI
      </button>
      <button class="btn" @click="changeGameType('normal-ai')">
        Normal AI
      </button>
    </div>
  </div>
</template>

<script>
import ChessBoard from "@/components/ChessBoard.vue";
import { ChessAI, ChessGame } from "./services/chess";

const ratio = 0.8;

export default {
  name: "App",
  data() {
    const [width, height] = [window.innerWidth, window.innerHeight];
    const game = new ChessGame();
    return {
      chessBoardSize: width > height ? height * ratio : width * ratio,
      fen: "",
      game,
      randomAI: new ChessAI({ type: "random" }),
      normalAI: new ChessAI({ type: "normal", depth: 3 }),
      winner: null,
      gameType: "normal-ai",
      isPlayTwoAI: false,
      aiMove: null,
    };
  },
  components: {
    ChessBoard,
  },
  watch: {
    fen(newValue) {
      console.log(newValue);
    },
  },
  mounted() {
    window.addEventListener("resize", this.myEventHandler);
  },
  unmounted() {
    window.removeEventListener("resize", this.myEventHandler);
  },
  methods: {
    myEventHandler() {
      const [width, height] = [window.innerWidth, window.innerHeight];
      this.chessBoardSize = width > height ? height * ratio : width * ratio;
    },
    async onMovePlayed({ move, game }) {
      game.makeMove(move);
      if (this.gameType !== "two-player") this.makeAiMove(game);
    },
    makeAiMove(game) {
      return setTimeout(() => {
        if (this.gameType === "random-ai") {
          if (!game.gameOver && game.currentPlayer === "black") {
            const aiMove = this.randomAI.selectMove(game.copy);
            game.makeMove(aiMove);
          }
        } else if (this.gameType === "normal-ai") {
          if (!game.gameOver && game.currentPlayer === "black") {
            const aiMove = this.normalAI.selectMove(game.copy);
            console.log(aiMove);
            game.makeMove(aiMove);
          }
        }
      }, 0);
    },
    onGameOver({ winner }) {
      this.winner = winner;
    },
    changeGameType(type) {
      this.isPlayTwoAI = false;
      this.gameType = type;
      this.game = new ChessGame();
    },
    undoMove() {
      this.game.undoMove();
      this.game.buildMoves();
    },
    async playTwoAI() {
      this.isPlayTwoAI = true;
      while (!this.game.gameOver && this.isPlayTwoAI) {
        const move = this.randomAI.selectMove(this.game.copy);
        this.game.makeMove(move);
        await this.sleep(300);
      }
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
}

.btn {
  height: 50px;
  width: 100px;
  margin-left: 20px;
  margin-bottom: 20px;
  display: block;
}
</style>
