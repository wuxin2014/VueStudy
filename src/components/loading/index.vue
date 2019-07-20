<template>
  <div class="loadings" v-show="isShow">
    <div class="loadings_loader">
      <van-loading type="spinner" color="#1989fa" />
    </div>
  </div>
</template>
<script type="text/babel">
export default {
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.loadings {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: transparent;
  /*background: rgba(0, 0, 0, .8);*/

  .loadings_loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
}
</style>
