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
    Fen: {{ fen }}
  </p>
  <div class="home">
    <chess-board
      :size="chessBoardSize"
      :game="game"
      :fen="fen"
      @onMovePlayed="onMovePlayed"
      @onGameOver="onGameOver"
    />
    <div>
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
      fen: "r5qk/7p/1bpp1p2/pp2p3/4P3/PB2BP1b/1PP2P1P/R2Q1RK1/ w - - 1 2",
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
    aiMove(move) {
      this.game.makeMove(move);
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
    onMovePlayed({ move, game }) {
      game.makeMove(move);
      this.fen = game.fen;
      this.makeAiMove(game);
    },
    async makeAiMove(game) {
      if (this.gameType === "random-ai") {
        if (!game.gameOver && game.currentPlayer === "black") {
          const aiMove = this.randomAI.selectMove(game.copy);
          game.makeMove(aiMove);
        }
      } else if (this.gameType === "normal-ai") {
        if (!game.gameOver && game.currentPlayer === "black") {
          const aiMove = this.normalAI.selectMove(game.copy);
          game.makeMove(aiMove);
        }
      }
      this.fen = game.fen;
    },
    onGameOver({ winner }) {
      this.winner = winner;
    },
    changeGameType(type) {
      this.isPlayTwoAI = false;
      this.gameType = type;
      this.game = new ChessGame();
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
