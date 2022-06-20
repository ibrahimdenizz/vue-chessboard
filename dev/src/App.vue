<template>
  <div>
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
        :size="chessBoardSize"
        :game="game"
        v-model:fen="fen"
        :disableBlackMoves="
          gameType === 'normal-ai' || gameType === 'random-ai'
        "
        @onMovePlayed="onMovePlayed"
        @onGameOver="onGameOver"
        orientation="black"
      />
      <div>
        <div class="btn-group">
          <button class="btn" @click="undoMove()">Undo</button>
          <button class="btn" @click="redoMove()">Redo</button>
        </div>
        <button class="btn" @click="resetGame()">Reset</button>
        <button
          :disabled="gameType === 'two-player'"
          class="btn"
          @click="changeGameType('two-player')"
        >
          Two player
        </button>
        <button
          :disabled="gameType === 'random-ai'"
          class="btn"
          @click="changeGameType('random-ai')"
        >
          Random AI
        </button>
        <button
          :disabled="gameType === 'normal-ai'"
          class="btn"
          @click="changeGameType('normal-ai')"
        >
          Normal AI
        </button>
        <div class="radio" v-if="gameType === 'normal-ai'">
          <p>AI execute environment:</p>
          <input
            type="radio"
            id="server"
            name="normal-ai-type"
            value="server"
            v-model="normalAIType"
          />
          <label for="server">Server</label>
          <input
            type="radio"
            id="web"
            name="normal-ai-type"
            value="web"
            v-model="normalAIType"
          />
          <label for="web">Web</label>
          <p v-if="normalAIType === 'web'" style="width: 200px">
            Be careful. Web version of AI have performance issue after 4 depth
          </p>
          <p>
            <label class="label" for="web">Depth</label>
            <input
              type="number"
              id="web"
              v-model="normalAIDepth"
              min="1"
              max="5"
            />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ChessBoard, ChessAI, ChessGame } from "@ibrahimdeniz/vue-chessboard";
import axios from "axios";
import "@ibrahimdeniz/vue-chessboard/dist/style.css";

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
      randomAI: new ChessAI("random"),
      normalAI: new ChessAI("normal", 3),
      normalAIType: "server",
      normalAIDepth: 1,
      winner: null,
      gameType: "normal-ai",
      isPlayTwoAI: false,
      aiMove: null,
    };
  },
  components: {
    ChessBoard,
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
      console.log(game.makeMove(move));
      if (this.gameType !== "two-player") this.makeAiMove(game);
    },
    makeAiMove(game) {
      return setTimeout(async () => {
        if (this.gameType === "random-ai") {
          if (!game.gameOver && game.currentPlayer === "black") {
            const aiMove = this.randomAI.selectMove(game.fen);
            game.makeMove(aiMove);
          }
        } else if (this.gameType === "normal-ai") {
          if (!game.gameOver && game.currentPlayer === "black") {
            let aiMove;
            if (this.normalAIType === "web") {
              aiMove = this.normalAI.selectMove(game.fen, {
                debug: true,
                depth: this.normalAIDepth,
              });
            } else {
              const response = await axios.get(
                `https://9ze1us9zsl.execute-api.eu-central-1.amazonaws.com/chess-ai`,
                {
                  params: {
                    fen: game.fen,
                    depth: this.normalAIDepth,
                  },
                }
              );
              aiMove = response.data;
            }

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
      console.log(this.game.redoHistory);
    },
    redoMove() {
      this.game.redoMove();
      console.log(this.game.redoHistory);
    },
    resetGame() {
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
  --vc-light-color: lightgray;
  --vc-dark-color: darkgray;
  --vc-move-color: red;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
}

.btn-group .btn {
  display: initial;
}

.btn {
  height: 50px;
  width: 100px;
  margin-left: 20px;
  margin-bottom: 20px;
  display: block;
}

.radio {
  height: 50px;
  margin-left: 20px;
  margin-bottom: 20px;
  display: block;
}

.label {
  display: block;
  margin-bottom: 10px;
}
</style>
