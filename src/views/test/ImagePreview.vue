<template>
  <div>
    <div class="mask"></div>
    <div class="light-swiper">
      <div class="swiper-wrap">
        <div class="swipe-item" v-for="img in images" :key="img">
          <img :src="img" />
        </div>
      </div>
      <div class="close-wrap" @click="close">
        <van-icon name="cross" size="34px" color="#cdcdcd" />
      </div>
      <div class="share-wrap" @click="picShared">
        <img
          src="../../common/images/material/share.png"
          width="34"
          alt="pic"
        />
      </div>
      <div class="download-wrap" @click="picDownload">
        {{ index
        }}<img
          src="../../common/images/material/download.png"
          width="34"
          alt="pic"
        />
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
    },
    curIndex: {
      type: Number,
      default: 0
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
    picShared() {
      this.$emit('handle-share', this.index);
    },
    picDownload() {
      console.log(this.index);
      this.$emit('handle-download', this.index);
    }
  },
  mounted() {
    console.log('hah', this.curIndex);
    const index = this.curIndex;
    this.index = index;
    const _this = this;
    const mySwiper = new Swiper(document.querySelector('.light-swiper'), {
      startSlide: index,
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

<style lang="scss" scoped>
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
  background: #000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;

  .swiper-wrap {
    overflow: hidden;
    position: relative;
  }

  .swipe-item {
    float: left;
    width: 100%;
    position: relative;
    img {
      height: 100vh;
      width: 100vw;
      object-fit: contain;
      vertical-align: middle;
    }
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
}
</style>
