<template>
  <div>
    <div class="mask"></div>
    <div class="light-swiper">
      <div class="swiper-wrap">
        <div class="swipe-item" v-for="img in images" :key="img">
          <img :src="img" width="100%" />
        </div>
      </div>
      <div class="close-wrap" @click="close">
        <van-icon name="cross" size="34px" color="#ffffff" />
      </div>
      <div class="share-wrap" @click="picShared">
        {{index}}<img src="../assets/share.png" width="34" alt="pic" />
      </div>
      <div class="download-wrap" @click="picDownload">
        <img src="../assets/download.png" width="34" alt="pic" />
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'light-swiper';

export default {
  name: 'popup',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      index: 0
    };
  },
  methods: {
    close() {
      this.$emit('handle-close');
    },
    picShared() {},
    picDownload() {}
  },
  mounted() {
    console.log('hah');
    const _this = this;
    const mySwiper = new Swiper(document.querySelector('.light-swiper'), {
      startSlide: 0,
      speed: 400,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
      callback(index, elem) {
        _this.index = index;
      },
      transitionEnd(index, elem) {
        _this.index = index;
      }
    });
  }
};
</script>

<style scoped>
.mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.light-swiper {
  overflow-x: hidden;
  position: fixed;
  height: 100vh;
  background: #000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.swiper-wrap {
  overflow: hidden;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.swipe-item {
  float: left;
  width: 100%;
  position: relative;
}

.close-wrap {
  position: absolute;
  top: 10px;
  left: 14px;
  z-index: 10000;
}

.share-wrap {
  position: absolute;
  top: 10px;
  right: 14px;
  z-index: 10002;
}

.download-wrap {
  position: absolute;
  bottom: 10px;
  right: 14px;
  z-index: 10004;
}
</style>
