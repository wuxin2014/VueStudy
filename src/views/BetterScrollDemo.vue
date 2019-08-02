<template>
  <div ref="wrapper" class="list-wrapper">
    <ul class="list-content">
      <li
        @click="clickItem($event, item)"
        class="list-item"
        v-for="item in list"
        :key="item"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
import BScroll from 'better-scroll';

export default {
  name: 'A',
  data() {
    return {
      list: []
    };
  },
  methods: {
    clickItem() {
      // todo 11
    }
  },
  created() {
    this.list = Array.from(new Array(100)).map((_, item) => item);
  },
  // 在 Vue 中，保证列表渲染完成时，初始化 BScroll
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {});
    });
  }
};
</script>

<style scoped></style>
