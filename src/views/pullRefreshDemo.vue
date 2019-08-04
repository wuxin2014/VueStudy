<template>
  <div>
    <div
      class="list-warp-template"
      @touchstart="handlerStart"
      @touchend="handlerEnd"
      @touchmove="handlerMove"
      @scroll="handlerScroll"
      ref="listWrapRef"
    >
      <div class="top-refresh" :style="{ height: refresh.height + 'px' }">
        <div v-show="refresh.height > 30">
          {{ refreshLoading ? '加载中' : '松开加载' }}
        </div>
      </div>
      <div class="main-list">
        <ul class="list-content">
          <li class="list-item" v-for="item in list" :key="item">
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="bottom-loading" v-show="bottomLoading">加载中</div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import pullRefresh from '../components/pullRefresh';
let timer = null
export default {
  name: 'pullRefreshDemo',
  data() {
    return {
      refreshLoading: false,
      bottomLoading: false,
      list: [],
      position: 0,
      startInit: 0,
      refresh: {
        height: 0
      }
    };
  },
  methods: {
    onRefresh() {
      console.log('refresh');
      setTimeout(() => {
        this.refresh.height = 0;
        this.refreshLoading = false;
      }, 2000);
    },
    OnBottom() {
      console.log('bottom');
      setTimeout(() => {
        this.bottomLoading = false;
      }, 2000);
    },
    onScroll() {
      console.log('scroll');
    },
    handlerScroll(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      console.log(clientHeight, scrollTop, scrollHeight);
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        // 判断是否到底了
        const isBottom = clientHeight + scrollTop + 40 >= scrollHeight;
        if (!this.bottomLoading && isBottom) {
          this.bottomLoading = true;
          this.OnBottom();
        }
      }, 200);
      // this.position = scrollTop;
      // 滚动事件，返回当前滚动位置
      // this.onScroll(scrollPosition);
    },
    // 返回顶部
    handlerBackTop() {
      const dom = this.$refs.listWrapRef;
      dom.scrollTop = 0;
    },
    // 触摸开始
    handlerStart(e) {
      this.startInit = parseInt(e.touches[0].clientY, 0);
    },
    // 滑动中,下拉
    handlerMove(e) {
      if (this.position === 0 && !this.refreshLoading) {
        const Y = parseInt(e.touches[0].clientY, 0);
        const range = Y - this.startInit;
        this.refresh.height = range;
      }
    },
    // 滑动结束
    handlerEnd() {
      if (this.refresh.height >= 30) {
        this.refresh.height = 40;
        this.refreshLoading = true;
        this.onRefresh();
      } else {
        this.refresh.height = 0;
      }
      this.startInit = 0;
    }
  },
  created() {
    this.list = Array.from(new Array(100)).map((_, item) => item);
  }
};
</script>

<style lang="scss">
.list-warp-template {
  display: block;
  height: 100vh;
  overflow-y: auto;

  .top-refresh {
    background-color: #ccc;
    height: 0;
    width: 100%;
    transition: height 0.1s linear;
    overflow: hidden;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-list {
    width: 100%;
  }

  .bottom-loading {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    width: 100%;
    background-color: #f0f0f0;
  }
}
</style>
