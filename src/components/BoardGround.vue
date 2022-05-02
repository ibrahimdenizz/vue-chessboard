<script>
import fenToBoardArr from "@/helpers/fenToBoardArr";
import { ChessGame } from "@/services/chess";

export default {
  name: "BoardGround",
  props: {
    size: Number,
    fen: String,
    game: ChessGame,
  },
  emits: ["selectPiece", "isActivePiece"],
  computed: {
    board() {
      return fenToBoardArr(this.fen);
    },
  },
  methods: {
    getPiece(x, y) {
      return this.game.getPiece(x, y);
    },
  },
};
</script>

<template>
  <template v-for="y in 8" :key="y">
    <div
      v-for="x in 8"
      :key="x"
      class="square"
      :class="x % 2 === y % 2 ? 'light-square' : 'dark-square'"
    >
      <div
        v-if="getPiece(x, y)"
        :class="
          $emit('isActivePiece', getPiece(x, y))
            ? 'piece active-piece'
            : 'piece'
        "
        @click="$emit('selectPiece', getPiece(x, y))"
      >
        <img
          :src="getPiece(x, y).img"
          :alt="getPiece(x, y).imgAlt"
          :width="size * 0.11"
          :height="size * 0.11"
        />
      </div>
    </div>
  </template>
  <div class="board-positions">
    <div
      v-for="i in 8"
      :key="i"
      class="number no-select"
      :class="i % 2 === 1 ? 'dark' : 'light'"
      :style="{ fontSize: `${size * 0.02}px` }"
    >
      {{ 9 - i }}
    </div>
  </div>
  <div class="board-positions letter">
    <div
      v-for="i in 8"
      :key="i"
      class="letters no-select"
      :class="i % 2 === 0 ? 'dark' : 'light'"
      :style="{ fontSize: `${size * 0.02}px` }"
    >
      {{ String.fromCharCode(96 + i) }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
$dark-color: #b58863;
$light-color: #f0d9b5;

.square {
  position: relative;
  width: 12.5%;
  height: 12.5%;
}

.light-square {
  background-color: $light-color;
}

.dark-square {
  background-color: $dark-color;
}

.board-positions {
  position: absolute;
  width: 100%;
  height: 100%;

  .number {
    text-align: left;
    margin-left: 0.5%;
    margin-top: 0.5%;
    width: 12%;
    height: 12%;

    &.dark {
      color: $dark-color;
    }
    &.light {
      color: $light-color;
    }
  }

  &.letter {
    display: flex;
    align-items: flex-end;
  }

  .letters {
    width: 12%;
    text-align: right;
    margin-right: 0.5%;
    margin-top: 0.5%;

    &.dark {
      color: $dark-color;
    }
    &.light {
      color: $light-color;
    }
  }
}
.piece {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
}
.active-piece {
  cursor: pointer;
}
</style>
