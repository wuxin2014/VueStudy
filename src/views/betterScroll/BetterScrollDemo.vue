<template>
  <div class="simple-scroll-demo">
    <div class="scroll-list-wrap">
      <scroll
        ref="scroll"
        :data="items"
        :scrollbar="scrollbarObj"
        :pullDownRefresh="pullDownRefreshObj"
        :pullUpLoad="pullUpLoadObj"
        :startY="parseInt(startY)"
        @pullingDown="onPullingDown"
        @pullingUp="onPullingUp"
      >
      </scroll>
    </div>
  </div>
</template>

<script>
import scroll from './components/scroll/scroll';

const ease = {
  // easeOutQuint
  swipe: {
    style: 'cubic-bezier(0.23, 1, 0.32, 1)',
    fn(t) {
      t -= 1;
      return 1 + t * t * t * t * t;
    }
  },
  // easeOutQuard
  swipeBounce: {
    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fn(t) {
      return t * (2 - t);
    }
  },
  // easeOutQuart
  bounce: {
    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    fn(t) {
      t -= 1;
      return 1 - t * t * t * t;
    }
  }
};

export default {
  name: 'xiao',
  components: {
    scroll
  },
  data() {
    return {
      scrollbar: true,
      scrollbarFade: true,
      pullDownRefresh: true,
      pullDownRefreshThreshold: 90,
      pullDownRefreshStop: 40,
      pullUpLoad: true,
      pullUpLoadThreshold: 0,
      pullUpLoadMoreTxt: 'defaultLoadTxtMore',
      pullUpLoadNoMoreTxt: 'defaultLoadTxtNoMore',
      startY: 0,
      scrollToX: 0,
      scrollToY: -200,
      scrollToTime: 700,
      scrollToEasing: 'bounce',
      scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],
      items: [],
      itemIndex: 0
    };
  },
  created() {
    for (let i = 0; i < 20; i += 1) {
      this.items.push(`list-${++this.itemIndex}`);
    }
  },
  watch: {
    scrollbarObj: {
      handler() {
        this.rebuildScroll();
      },
      deep: true
    },
    pullDownRefreshObj: {
      handler() {
        this.rebuildScroll();
      },
      deep: true
    },
    pullUpLoadObj: {
      handler() {
        this.rebuildScroll();
      },
      deep: true
    },
    startY() {
      this.rebuildScroll();
    }
  },
  computed: {
    scrollbarObj() {
      return this.scrollbar ? { fade: this.scrollbarFade } : false;
    },
    pullDownRefreshObj() {
      return this.pullDownRefresh
        ? {
            threshold: parseInt(this.pullDownRefreshThreshold),
            stop: parseInt(this.pullDownRefreshStop)
          }
        : false;
    },
    pullUpLoadObj() {
      return this.pullUpLoad
        ? {
            threshold: parseInt(this.pullUpLoadThreshold),
            txt: {
              more: this.pullUpLoadMoreTxt,
              noMore: this.pullUpLoadNoMoreTxt
            }
          }
        : false;
    }
  },
  methods: {
    scrollTo() {
      this.$refs.scroll.scrollTo(
        this.scrollToX,
        this.scrollToY,
        this.scrollToTime,
        ease[this.scrollToEasing]
      );
    },
    onPullingDown() {
      // 模拟更新数据
      setTimeout(() => {
        if (Math.random() > 0.5) {
          // 如果有新数据
          this.items.unshift(`newDataTxt-${+new Date()}`);
        } else {
          // 如果没有新数据
          this.$refs.scroll.forceUpdate();
        }
      }, 2000);
    },
    onPullingUp() {
      // 更新数据
      console.log('pulling up and load data');
      setTimeout(() => {
        if (Math.random() > 0.5) {
          // 如果有新数据
          const newPage = [];
          for (let i = 0; i < 10; i += 1) {
            newPage.push(`loadData-${++this.itemIndex}`);
          }

          this.items = this.items.concat(newPage);
        } else {
          // 如果没有新数据
          this.$refs.scroll.forceUpdate();
        }
      }, 1500);
    },
    rebuildScroll() {
      this.$nextTick(() => {
        this.$refs.scroll.destroy();
        this.$refs.scroll.initScroll();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.simple-scroll-demo {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  flex: 0 0 100%;
  /*margin-bottom: 1rem*/
  margin: 10px;
  .scroll-list-wrap {
    position: relative;
    height: 100%;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    transform: rotate(0deg);
    overflow: hidden;
  }
}
</style>
