<template>
  <div class="wrap">
    <div class="top_wrap" ref="topWrapper">
      <div class="img-box">
        <div class="img-wrap">
          <img :src="qrImgUrl" class="img" ref="imgRef" />
        </div>
        <div class="tip-text">微信扫码进入自己的店铺</div>
      </div>
      <p class="btn-wrap">
        <span
          class="btn-cls"
          v-preventReClick="1000"
          @click="handleSave($event)"
        />
      </p>
    </div>
    <van-dialog
      v-model="show"
      title="长按保存图片"
      :closeOnClickOverlay="true"
      :showConfirmButton="false"
      :showCancelButton="false"
    >
      <img :src="url" alt="" class="dialog-pic-wrap" />
    </van-dialog>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import { Toast } from 'vant';
import { getNewQrImg } from '../../utils/util';

export default {
  name: 'index',
  data() {
    return {
      qrImgUrl: '',
      url: '',
      show: false
    };
  },
  methods: {
    getPixelRatio(context) {
      const backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;
      return (window.devicePixelRatio || 1) / backingStore;
    },
    createCanvas(selectDOM) {
      const canvasDOM = document.createElement('canvas');
      const context = canvasDOM.getContext('2d');
      const radio = this.getPixelRatio(context);
      canvasDOM.width = selectDOM.offsetWidth * radio;
      canvasDOM.height = selectDOM.offsetHeight * radio;
      canvasDOM.style.width = `${selectDOM.offsetWidth}px`;
      canvasDOM.style.height = `${selectDOM.offsetHeight}px`;
      context.scale(3, 3);
      context.mozImageSmoothingEnabled = false;
      context.webkitImageSmoothingEnabled = false;
      context.msImageSmoothingEnabled = false;
      context.imageSmoothingEnabled = false;
      return canvasDOM;
    },
    async handleSave(event) {
      if (this.qrImgUrl === '') {
        this.$toast('二维码地址不存在');
        return;
      }
      let timer = null;
      if (event.target.disabled) return; // 节流 防滑
      Toast.loading({
        message: 'loading....',
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        position: 'bottom',
        className: 'share-loading'
        // mask: true
      });
      const activeDom = document.querySelector('.img-box');
      const canvasDOM = this.createCanvas(activeDom);
      const canvas = await html2canvas(activeDom, {
        canvas: canvasDOM,
        scale: 3,
        width: activeDom.offsetWidth,
        height: activeDom.offsetHeight,
        dpi: window.devicePixelRatio,
        backgroundColor: 'transparent',
        useCORS: true,
        allowTaint: false,
        y: -1
      });
      const url = canvas.toDataURL('image/png', 0.92);
      this.url = url;
      this.show = true;
      // this.downloadImage(url);

      timer = setTimeout(() => {
        Toast.clear();
        clearTimeout(timer);
      }, 100);
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  .top_wrap {
    height: 12.08rem;
    position: relative;

    .img-box {
      height: 10.54rem;
      position: relative;
      background: url('../../assets/top-bg.png');
      background-size: 100%;
      .img-wrap {
        position: absolute;
        bottom: 1rem;
        left: 50%;
        width: 2.8rem;
        height: 2.8rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid red;
        margin-top: 0.26rem;
        margin-left: -1.4rem;
        background: #fff;
        border-radius: 5px;

        .img {
          width: 2.6rem;
          height: 2.6rem;
          object-fit: cover;
        }
      }

      .tip-text {
        width: 100%;
        position: absolute;
        bottom: 0.5rem;
        font-size: 0.26rem;
        font-weight: 400;
        color: rgba(255, 238, 204, 1);
        text-align: center;
      }
    }
  }

  .btn-wrap {
    width: 100%;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../../assets/top-bottom-bg.png') no-repeat;
    .btn-cls {
      width: 4.54rem;
      height: 1.72rem;
      background: url('../../assets/top-btn-bg.png') no-repeat;
      background-size: 100%;
      font-weight: 500;
      color: rgba(230, 37, 37, 1);
      font-size: 0.32rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
}
</style>
