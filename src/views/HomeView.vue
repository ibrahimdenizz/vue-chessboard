<template>
  <div class="home">
    <chess-board :size="chessBoardSize" :fen="fen" @onFenChange="onFenChange" />
  </div>
</template>

<script>
// @ is an alias to /src
import ChessBoard from "@/components/ChessBoard.vue";
import { DEFAULT_FEN } from "@/constants/chess";

const ratio = 0.8;

export default {
  name: "HomeView",
  data() {
    const [width, height] = [window.innerWidth, window.innerHeight];
    return {
      chessBoardSize: width > height ? height * ratio : width * ratio,
      fen: DEFAULT_FEN,
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
    onFenChange(newFen) {
      this.fen = newFen;
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
  align-items: center;
}
</style>
