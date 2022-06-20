<script>
import ChessPiece from "./ChessPiece.vue";

export default {
  name: "Board",
  data() {
    return {
      render: false,
    };
  },
  props: {
    size: Number,
    game: Object,
    isActivePiece: Function,
    orientation: String,
  },
  emits: ["selectPiece", "isActivePiece"],
  watch: {
    "game.fen": {
      handler() {
        this.render = !this.render;
      },
    },
  },
  methods: {
    getPiece(x, y) {
      if (this.orientation === "black") return this.game.getPiece(9 - x, 9 - y);

      return this.game.getPiece(x, y);
    },
  },
  components: { ChessPiece },
};
</script>

<template>
  <div class="vc-board-ground">
    <template v-for="y in 8">
      <div
        v-for="x in 8"
        :key="y * x"
        class="vc-square"
        :class="x % 2 === y % 2 ? 'vc-light-square' : 'vc-dark-square'"
      >
        <div
          v-if="getPiece(x, y)"
          :class="
            isActivePiece(getPiece(x, y))
              ? 'vc-piece vc-active-piece'
              : 'vc-piece'
          "
          @click="$emit('selectPiece', getPiece(x, y))"
        >
          <chess-piece :size="size" :piece="getPiece(x, y)" />
        </div>
      </div>
    </template>
    <div class="vc-board-positions">
      <div
        v-for="i in 8"
        :key="i"
        class="vc-number vc-no-select"
        :class="i % 2 === 1 ? 'vc-dark' : 'vc-light'"
        :style="{ fontSize: `${size * 0.02}px` }"
      >
        {{ orientation === "black" ? i : 9 - i }}
      </div>
    </div>
    <div class="vc-board-positions vc-letter">
      <div
        v-for="i in 8"
        :key="i"
        class="vc-letters vc-no-select"
        :class="i % 2 === 0 ? 'vc-dark' : 'vc-light'"
        :style="{ fontSize: `${size * 0.02}px` }"
      >
        {{
          orientation === "black"
            ? String.fromCharCode(96 + (9 - i))
            : String.fromCharCode(96 + i)
        }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$light-color: var(--vc-light-color);
$dark-color: var(--vc-dark-color);

.vc-board-ground {
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.vc-square {
  position: relative;
  width: 12.5%;
  height: 12.5%;
}

.vc-light-square {
  background-color: $light-color;
}

.vc-dark-square {
  background-color: $dark-color;
}

.vc-board-positions {
  position: absolute;
  width: 100%;
  height: 100%;

  .vc-number {
    text-align: left;
    margin-left: 0.5%;
    margin-top: 0.5%;
    width: 12%;
    height: 12%;

    &.vc-dark {
      color: $dark-color;
    }
    &.vc-light {
      color: $light-color;
    }
  }

  &.vc-letter {
    display: flex;
    align-items: flex-end;
  }

  .vc-letters {
    width: 12%;
    text-align: right;
    margin-right: 0.5%;
    margin-top: 0.5%;

    &.vc-dark {
      color: $dark-color;
    }
    &.vc-light {
      color: $light-color;
    }
  }
}
.vc-piece {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
.vc-active-piece {
  cursor: pointer;
}

.vc-no-select {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}
</style>
