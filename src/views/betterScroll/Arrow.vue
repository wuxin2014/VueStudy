<template>
  <svg viewBox="-18 -18 100 100" xml:space="preserve">
    <g>
      <polygon
        points="32, 64 0, 36 2.5, 32 32, 58 61, 32 64, 36"
        :fill="color"
      ></polygon>
      <rect x="30" width="4" height="60" :fill="color"></rect>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'Arrow',
  props: {
    color: {
      type: String,
      default: '#000000'
    }
  }
};
</script>
