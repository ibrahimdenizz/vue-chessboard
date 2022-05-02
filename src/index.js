import ChessBoard from "@/components/ChessBoard.vue";

const plugin = {
  install(app) {
    app.component("ChessBoard", ChessBoard);
  },
};

export default plugin;
