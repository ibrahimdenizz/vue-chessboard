<template>
  <div class="home">
    <chess-board :size="chessBoardSize" v-model:fen="fen" />
  </div>
</template>

<script>
import ChessBoard from "@/components/ChessBoard.vue";
import { DEFAULT_FEN } from "./constants/chess";

const ratio = 0.8;

export default {
  name: "App",
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
