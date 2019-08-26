<template>
  <div class="better-scroll" ref="wrapper">
    <div class="better-scroll-content" ref="content">
      <slot>
        <div class="scroll-wrapper scroll-default-wrapper">
          <p>列表无数据</p>
        </div>
      </slot>
      <div
        class="scroll-wrapper scroll-pulldown-wrapper"
        v-if="optionsValue.pulldown"
      >
        <template v-if="isPullingDown">
          <spinner
            width="42px"
            height="42px"
            color="#8f8f8f"
            :options="{ itemWidth: 4 }"
          />
          <p>正在刷新</p>
        </template>
        <p v-else-if="isPullingDownSucess">数据刷新成功</p>
        <template v-else>
          <arrow
            class="arrow"
            width="32px"
            height="32px"
            color="#8f8f8f"
            :class="{ 'rotate-180': canPullingDown }"
          />
          <p v-if="canPullingDown">释放立即刷新</p>
          <p v-else>下拉刷新数据</p>
        </template>
      </div>
      <div
        class="scroll-wrapper scroll-pullup-wrapper"
        v-if="optionsValue.pullup"
      >
        <template v-if="isPullingUp">
          <spinner
            width="42px"
            height="42px"
            color="#8f8f8f"
            :options="{ itemWidth: 4 }"
          />
          <p>正在加载</p>
        </template>
        <p v-else-if="data && isPullingUpEnd">没有更多数据了</p>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
// eslint-disable-next-line import/extensions
import Arrow from './Arrow';
// eslint-disable-next-line import/extensions
import Spinner from './Spinner';

// bounce默认值
const BOUNCE_DEFAULT = {
  top: true,
  bottom: true,
  left: true,
  right: true
};

// options默认值
const OPTINGS_DEFAULT = {
  pullup: false,
  pulldown: false,
  click: true,
  probeType: 0
};

// 上拉加载默认配置
const PULL_UP_DEFAULT = {
  threshold: 72
};

// 下拉刷新默认配置
const PULL_DOWN_DEFAULT = {
  threshold: 72,
  stop: 54
};

// 下拉刷新等待时间及事件延迟时间
const PULLING_DOWN_AWAIT = 750;
const PULLING_EVENT_AWAIT = 500;

export default {
  data() {
    return {
      isPullingUp: false,
      isPullingUpEnd: false,
      isPullingDown: false,
      isPullingDownSucess: false,
      canPullingDown: false
    };
  },
  props: {
    data: [Object, Array],
    scrollbar: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'vertical'
    },
    bounce: Object,
    options: Object
  },
  computed: {
    directionValue() {
      switch (this.direction) {
        case 'vertical':
          return false;
        case 'horizontal':
          return true;
        default:
          return false;
      }
    },
    bounceValue() {
      return this.bounce
        ? Object.assign({}, BOUNCE_DEFAULT, this.bounce)
        : BOUNCE_DEFAULT;
    },
    optionsValue() {
      return this.options
        ? Object.assign({}, OPTINGS_DEFAULT, this.options)
        : OPTINGS_DEFAULT;
    },
    pullDownRefresh() {
      const { pulldown } = this.optionsValue;
      return pulldown && typeof pulldown === 'boolean'
        ? PULL_DOWN_DEFAULT
        : pulldown;
    },
    pullUpLoad() {
      const { pullup } = this.optionsValue;
      return pullup && typeof pullup === 'boolean' ? PULL_UP_DEFAULT : pullup;
    }
  },
  watch: {
    data() {
      this.$nextTick(this.refresh);
    }
  },
  methods: {
    initBScroll() {
      // 初始化better-scroll组件
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.optionsValue.probeType,
        click: this.optionsValue.click,
        scrollX: this.directionValue,
        scrollY: !this.directionValue,
        bounce: this.bounceValue,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad,
        scrollbar: this.scrollbar ? { fade: true } : undefined
      });

      // 底部上拉事件监听
      if (this.optionsValue.pullup) {
        this.scroll.on('pullingUp', () => {
          if (!this.isPullingUpEnd) {
            this.isPullingUp = true;
            setTimeout(() => this.$emit('pullup'), PULLING_EVENT_AWAIT);
          } else this.scroll.finishPullUp();
        });
      }

      // 顶部下拉事件监听
      if (this.optionsValue.pulldown) {
        this.scroll.on('pullingDown', () => {
          this.isPullingDown = true;
          this.isPullingUpEnd = false;
          setTimeout(() => this.$emit('pulldown'), PULLING_EVENT_AWAIT);
        });

        // 监听下拉加载开始状态
        const pullDownHeight = this.pullDownRefresh.threshold;
        this.scroll.on('scroll', e => {
          if (e.y >= pullDownHeight && !this.canPullingDown) {
            this.canPullingDown = true;
          } else if (e.y < pullDownHeight && this.canPullingDown) {
            this.canPullingDown = false;
          }
        });
      }
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      if (!this.scroll) return;

      if (this.isPullingUp) {
        this.isPullingUp = false;
        this.scroll.finishPullUp();
        this.scroll.refresh();
      } else if (this.isPullingDown) {
        this.isPullingDown = false;
        this.isPullingDownSucess = true;
        setTimeout(() => {
          this.scroll.finishPullDown();
          this.scroll.refresh();
          this.isPullingDownSucess = false;
        }, PULLING_DOWN_AWAIT);
      } else if (!this.isPullingDownSucess) {
        // 非任意刷新状态下, 则直接刷新
        this.scroll.refresh();
      }
    },
    destroy() {
      this.scroll && this.scroll.destroy();
      this.scroll = null;
      delete this.scroll;
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    pullupEnd() {
      this.isPullingUpEnd = true;
      this.refresh();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initBScroll();
    });
  },
  activated() {
    this.enable();
  },
  deactivated() {
    this.disable();
  },
  beforeDestroy() {
    this.destroy();
  },
  components: {
    Arrow,
    Spinner
  }
};
</script>

<style>
.better-scroll {
  overflow: hidden;
}
.better-scroll .bscroll-vertical-scrollbar {
  width: 4px !important;
}
.better-scroll .bscroll-vertical-scrollbar .bscroll-indicator {
  background: rgba(0, 0, 0, 0.25) !important;
  border: unset !important;
}
.better-scroll-content {
  position: relative;
  min-height: calc(100% + 2px);
  min-height: -webkit-calc(100% + 2px);
}
.better-scroll .scroll-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.better-scroll .scroll-wrapper p {
  font-size: 16px;
}
.better-scroll .scroll-pullup-wrapper {
  color: #8f8f8f;
  width: 100%;
  height: 1rem;
  padding: 0.3rem 0;
}
.better-scroll .scroll-pulldown-wrapper {
  position: absolute;
  top: -54px;
  width: 100%;
  height: 54px;
}
.better-scroll .scroll-pulldown-wrapper .arrow {
  transition: transform 300ms linear;
}
.better-scroll .scroll-pulldown-wrapper .arrow.rotate-180 {
  transform: rotate(180deg);
}
.better-scroll .scroll-default-wrapper {
  padding: 16px 0;
}
</style>
