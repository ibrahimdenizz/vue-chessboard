<template>
  <!-- White Pieces -->
  <white-bishop v-if="pieceName === 'white/bishop'" :size="pieceSize" />
  <white-king v-else-if="pieceName === 'white/king'" :size="pieceSize" />
  <white-knight v-else-if="pieceName === 'white/knight'" :size="pieceSize" />
  <white-pawn v-else-if="pieceName === 'white/pawn'" :size="pieceSize" />
  <white-queen v-else-if="pieceName === 'white/queen'" :size="pieceSize" />
  <white-rook v-else-if="pieceName === 'white/rook'" :size="pieceSize" />

  <!-- Black Pieces -->
  <black-bishop v-else-if="pieceName === 'black/bishop'" :size="pieceSize" />
  <black-king v-else-if="pieceName === 'black/king'" :size="pieceSize" />
  <black-knight v-else-if="pieceName === 'black/knight'" :size="pieceSize" />
  <black-pawn v-else-if="pieceName === 'black/pawn'" :size="pieceSize" />
  <black-queen v-else-if="pieceName === 'black/queen'" :size="pieceSize" />
  <black-rook v-else-if="pieceName === 'black/rook'" :size="pieceSize" />
</template>

<script>
// White Pieces
import WhiteBishop from "@/assets/chess-pieces/white/bishop.vue";
import WhiteKing from "@/assets/chess-pieces/white/king.vue";
import WhiteKnight from "@/assets/chess-pieces/white/knight.vue";
import WhitePawn from "@/assets/chess-pieces/white/pawn.vue";
import WhiteQueen from "@/assets/chess-pieces/white/queen.vue";
import WhiteRook from "@/assets/chess-pieces/white/rook.vue";

// Black Pieces
import BlackBishop from "@/assets/chess-pieces/black/bishop.vue";
import BlackKing from "@/assets/chess-pieces/black/king.vue";
import BlackKnight from "@/assets/chess-pieces/black/knight.vue";
import BlackPawn from "@/assets/chess-pieces/black/pawn.vue";
import BlackQueen from "@/assets/chess-pieces/black/queen.vue";
import BlackRook from "@/assets/chess-pieces/black/rook.vue";

export default {
  name: "ChessPiece",
  components: {
    WhiteBishop,
    WhiteKing,
    WhiteKnight,
    WhitePawn,
    WhiteQueen,
    WhiteRook,
    BlackBishop,
    BlackKing,
    BlackKnight,
    BlackPawn,
    BlackQueen,
    BlackRook,
  },
  props: ["piece", "size"],
  computed: {
    pieceName() {
      return this.piece.color + "/" + this.piece.pieceName;
    },
    pieceSize() {
      return this.size * 0.11;
    },
  },
};
</script>
