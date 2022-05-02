<template>
  <div class="home">
    <chess-board :size="chessBoardSize" :fen="fen" @onFenChange="onFenChange" />
  </div>
</template>

<script>
import ChessBoard from "@/components/ChessBoard.vue";

const ratio = 0.8;

export default {
  name: "App",
  data() {
    const [width, height] = [window.innerWidth, window.innerHeight];
    return {
      chessBoardSize: width > height ? height * ratio : width * ratio,
      fen: "rnbk1b1r/pp3ppp/2p5/4q1B1/4n3/8/PPP2PPP/2KR1BNR b - - 1 10",
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
