<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :width="size"
    :height="size"
    viewBox="0 0 45 45"
    version="1.1"
  >
    <g id="surface1">
      <path
        style="
          fill-rule: nonzero;
          fill: rgb(100%, 100%, 100%);
          fill-opacity: 1;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: miter;
          stroke: rgb(0%, 0%, 0%);
          stroke-opacity: 1;
          stroke-miterlimit: 4;
        "
        d="M 22.5 9 C 20.289062 9 18.5 10.789062 18.5 13 C 18.5 13.890625 18.789062 14.710938 19.28125 15.378906 C 17.328125 16.5 16 18.589844 16 21 C 16 23.03125 16.941406 24.839844 18.410156 26.03125 C 15.410156 27.089844 11 31.578125 11 39.5 L 34 39.5 C 34 31.578125 29.589844 27.089844 26.589844 26.03125 C 28.058594 24.839844 29 23.03125 29 21 C 29 18.589844 27.671875 16.5 25.71875 15.378906 C 26.210938 14.710938 26.5 13.890625 26.5 13 C 26.5 10.789062 24.710938 9 22.5 9 Z M 22.5 9 "
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: "WhitePawn",
  props: {
    size: Number,
  },
};
</script>
