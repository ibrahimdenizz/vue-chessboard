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
      v-model:fen="fen"
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
      <button class="btn" @click="playTwoAI()">Two Random AI</button>
    </div>
  </div>
</template>

<script>
import ChessBoard from "@/components/ChessBoard.vue";
import { DEFAULT_FEN } from "./constants/chess";
import { ChessAI, ChessGame } from "./services/chess";

const ratio = 0.8;

export default {
  name: "App",
  data() {
    const [width, height] = [window.innerWidth, window.innerHeight];
    return {
      chessBoardSize: width > height ? height * ratio : width * ratio,
      fen: "",
      game: new ChessGame(),
      randomAI: new ChessAI({ type: "random" }),
      winner: null,
      gameType: "random-ai",
      isPlayTwoAI: false,
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
    onMovePlayed({ game }) {
      if (this.gameType === "random-ai")
        if (!game.gameOver && game.currentPlayer === "black") {
          const move = this.randomAI.selectMove(game.copy);
          game.makeMove(move);
          this.fen = game.fen;
        }
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
        console.log(this.game.moves);
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
