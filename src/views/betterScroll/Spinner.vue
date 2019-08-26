<template>
  <svg
    class="lds-spinner"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    style="background: none;"
  >
    <g
      v-for="index in itemCount"
      :key="index"
      :transform="`rotate(${(360 / itemCount) * (index - 1)} 50 50)`"
    >
      <rect
        x="47"
        y="24"
        rx="9.4"
        ry="4.8"
        :width="itemWidth"
        :height="itemHeight"
        :fill="color"
      >
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          :begin="0 - (1 / itemCount) * index"
          repeatCount="indefinite"
        ></animate>
      </rect>
    </g>
  </svg>
</template>

<script>
const OPTINGS_DEFAULT = {
  itemCount: 10,
  itemWidth: 6,
  itemHeight: 12
};

export default {
  props: {
    color: {
      type: String,
      default: '#51a57c'
    },
    options: Object
  },
  computed: {
    optionsValue() {
      return this.options
        ? Object.assign({}, OPTINGS_DEFAULT, this.options)
        : OPTINGS_DEFAULT;
    },
    itemCount() {
      return this.optionsValue.itemCount;
    },
    itemWidth() {
      return this.optionsValue.itemWidth;
    },
    itemHeight() {
      return this.optionsValue.itemHeight;
    }
  }
};
</script>
