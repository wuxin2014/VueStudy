<template>
  <div class="list-content" @click="handleTop" id="wrapper">
    <van-pull-refresh
      v-model="isRefreshing"
      @refresh="onRefresh"
      style="min-height: 80%"
    >
      <div v-for="item in list" :key="item.id">
        <div v-if="item.showDate" class="date-wrap">
          <span>{{ item.showTime | transDate }}</span>
        </div>
        <div class="list-item">
          <!-- 选择框 -->
          <div
            style="margin-right: 10px; margin-top: -10px;"
            v-if="item.type === 2 && isShowCheckBox === true"
            @click="selectShareContent(item.id)"
          >
            <van-icon
              name="checked"
              size="26px"
              v-if="item.selected"
              color="dodgerblue"
            ></van-icon>
            <van-icon
              name="checked"
              size="26px"
              v-else
              color="#cdcdcd"
            ></van-icon>
          </div>
          <!-- 头像 -->
          <div class="avatar-wrap">
            <img
              src="../../common/images/material/avatar.png"
              class="avatar-img"
              alt="pic"
            />
          </div>
          <!-- 内容 -->
          <div class="content-wrap">
            <!-- 小标题 -->
            <div class="content-title">
              <span style="font-size: 12px">种草小可爱</span>
            </div>
            <!-- 根据类型展示 -->
            <!-- 纯文本 -->
            <div
              class="text-type-wrap"
              v-if="item.type === 1"
              style="user-select:text"
            >
              <p class="text-wrap" v-html="item.content"></p>
            </div>
            <!-- 图片 -->
            <div class="text-type-wrap" v-else-if="item.type === 2">
              <span
                class="tooltip-text"
                v-show="showShareTip && item.id === curId"
                @click.stop="handleShare(item)"
                >分享</span
              >
              <div
                class="img-wrap"
                @click.stop
                v-tap="e => vueTouch(item, 'tap', e)"
                v-longtap="e => vueTouch(item, 'longTap', e)"
              >
                <img v-lazy="item.filename" />
              </div>
            </div>
            <!-- 视频 -->
            <div class="text-type-wrap" v-else-if="item.type === 3">
              <span
                class="tooltip-text"
                v-show="showVideoShareTip && item.id === curId"
                @click.stop="handleShare(item)"
                >分享</span
              >
              <div
                class="video-wrap"
                @click.stop
                v-tap="e => vueTouch(item, 'tap', e)"
                v-longtap="e => vueTouch(item, 'longTap', e)"
              >
                <img
                  src="../../common/images/material/default-pic.jpg"
                  class="video"
                />
                <div class="play-video-icon">
                  <img
                    src="../../common/images/material/start.png"
                    width="40"
                    alt="pic"
                  />
                </div>
              </div>
            </div>
            <!-- 链接 -->
            <div class="text-type-wrap" v-else-if="item.type === 4">
              <span
                class="tooltip-text"
                v-show="showLinkCopyTip && item.id === curId"
                @click.stop="handleCopy(item)"
                >复制</span
              >
              <div
                class="text-wrap"
                @click.stop
                v-tap="e => vueTouch(item, 'tap', e)"
                v-longtap="e => vueTouch(item, 'longTap', e)"
              >
                <a style="text-decoration: underline; color: dodgerblue;">{{
                  item.content
                }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <!-- 图片预览 -->
    <image-preview
      v-if="show"
      :images="images"
      :curIndex="index"
      @handle-close="close"
      @handle-share="picShared"
      @handle-download="picDownload"
    />
    <!-- 底部分享按钮 -->
    <div
      class="bottom-share"
      v-show="isShowCheckBox"
      @click="handleBottomShared"
    >
      <img src="../../common/images/material/share-bottom.png" alt="pic" />
      <span>{{ `分享(${selectNum}/9)` }}</span>
    </div>
  </div>
</template>

<script>
import AKJS from '@akc/akjs';
import { Toast } from 'vant';
import ImagePreview from './ImagePreview';

export default {
  name: 'material',
  components: {
    ImagePreview
  },
  data() {
    return {
      userId: '',
      list: [],
      // 最多选择图片数量
      maxNum: 9,
      selectNum: 0,

      isRefreshing: false, // 下拉刷新
      orientation: 'ORIGIN', // UP, DOWN
      isLoading: false,
      mlId: 1,
      mlSize: 2,

      show: false,
      index: 0,
      images: [],
      showIndexNum: 1,

      curId: '',
      showShareTip: false,
      showLinkCopyTip: false,
      showVideoShareTip: false,
      isShowCheckBox: false,
      firstLoading: false,

      contentHeight: 0
    };
  },
  filters: {
    transDate(longTime) {
      longTime = Number(longTime);
      const targetDate = new Date(longTime);
      const year = targetDate.getFullYear();
      const mouth = targetDate.getMonth() + 1;
      const day = targetDate.getDate();
      let hour = targetDate.getHours();
      let minus = targetDate.getMinutes();

      const now = new Date();
      const nowDay = now.getDate();
      const nowMouth = now.getMonth() + 1;
      const nowLongTime = now.getTime();

      let dayDiff = (nowLongTime - longTime) / 86400000;

      // 时间差小于1,同一天显示今天
      if (dayDiff < 1 && nowDay === day) {
        dayDiff = 0;
      }

      // 时间差小于1,相隔一天显示昨天
      if (dayDiff < 1 && nowDay - day === 1) {
        dayDiff = 1;
      }

      // 时间差大于1小于2, 月份相隔一月或相隔一天显示昨天
      if (
        dayDiff >= 1 &&
        dayDiff < 2 &&
        (mouth + 1 === nowMouth || nowDay - day === 1)
      ) {
        dayDiff = 1;
      }

      hour = hour < 10 ? `0${hour}` : hour;
      minus = minus < 10 ? `0${minus}` : minus;

      let result = '';
      if (dayDiff === 0) {
        result = `今天${hour}:${minus}`;
      } else if (dayDiff === 1) {
        result = `昨天${hour}:${minus}`;
      } else {
        result = `${year}-${mouth}-${day} ${hour}:${minus}`;
      }
      return result;
    }
  },
  methods: {
    // 下拉刷新
    onRefresh() {
      this.curId = '';
      this.selectNum = 0;
      this.isShowCheckBox = false;
      this.orientation = 'DOWN';
      this.isRefreshing = true;

      this.mlId = this.list.slice(0, 1)[0].groupId;
      this.fetchList();
    },
    // 上拉加载
    onLoad() {
      this.orientation = 'UP';
      this.mlId = this.list.slice(this.list.length - 1)[0].groupId;
      this.fetchList();
    },
    // 获取列表数据
    async fetchList() {
      if (!this.userId) {
        const res = await this.$app.getaccount();
        this.userId = res.data.userID;
      }
      this.$materail
        .getMaterialList({
          userId: this.userId,
          orientation: this.orientation,
          mlId: this.mlId,
          mlSize: this.mlSize
        })
        .then(res => {
          const { data } = res;
          const resList = data || [];
          let newResList = [];

          resList.forEach(dataItem => {
            let { materials } = dataItem;
            let { materialName, id, showTime } = dataItem;
            materials = materials || [];
            if (materials.length > 0) {
              materials = materials.map(item => {
                item.materialName = materialName;
                item.groupId = id;
                item.showTime = showTime;
                if (item.type === 2 || item.type === 3) {
                  item.content = JSON.parse(item.content);
                }
                return item;
              });
              materials = materials.sort((a, b) => b.sequence - a.sequence);

              materials.forEach((item, index) => {
                if (index === 0) {
                  item.showDate = true;
                } else {
                  item.showDate = false;
                }
                if (item.type === 1 || item.type === 4) {
                  newResList.push(item);
                }
                if (item.type === 2 || item.type === 3) {
                  const { content, ...rest } = item;
                  const newContentData = content.map(conItem => {
                    let { filename } = conItem;
                    filename = filename.slice(filename.lastIndexOf('/') + 1);
                    return {
                      ...conItem,
                      ...rest,
                      id: `${rest.id}-${filename}`
                    };
                  });
                  newResList = newResList.concat(newContentData);
                }
              });
            }
          });

          if (this.orientation === 'UP') {
            // 拉取最新数据
            this.list = this.list.concat(newResList);
            setTimeout(() => {
              this.isLoading = false;
              this.$loading.close();
              this.wrapper.scrollTop -= 10;
            }, 1000);
          } else if (this.orientation === 'DOWN') {
            // 拉取历史数据
            this.list = newResList.concat(this.list);
            setTimeout(() => {
              this.isRefreshing = false;
            }, 1000);
            this.$nextTick(() => {
              this.wrapper.scrollTo(
                0,
                this.wrapper.scrollHeight - this.contentHeight
              );
              this.contentHeight = this.wrapper.scrollHeight;
            });
          } else {
            this.list = newResList;
            this.$nextTick(() => {
              const contentHeight = this.wrapper.scrollHeight;
              this.wrapper.scrollTo(0, contentHeight - 10);
              this.contentHeight = contentHeight;
            });
          }
        })
        .catch(() => {
          this.isRefreshing = false;
          this.$toast('请求失败，请重试');
        })
        .finally(() => {
          if (this.firstLoading) {
            this.$loading.close();
            this.firstLoading = false;
          }
        });
    },
    // 长按事件跟点击事件的处理
    vueTouch(curItem, eventName, e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
      e.preventDefault();
      const tmpShowTip = !this.isShowCheckBox;
      switch (Number(curItem.type)) {
        case 2:
          if (eventName === 'tap') {
            if (
              this.showVideoShareTip ||
              this.showLinkCopyTip ||
              this.showShareTip
            ) {
              return;
            }
            if (this.isShowCheckBox) {
              this.selectShareContent(curItem.id);
            } else {
              this.goPreviewPage(curItem);
            }
          } else if (eventName === 'longTap') {
            this.curId = curItem.id;
            this.showLinkCopyTip = false;
            this.showVideoShareTip = false;
            this.showShareTip = tmpShowTip;
          }
          break;
        case 3:
          if (eventName === 'tap') {
            if (
              this.showShareTip ||
              this.showLinkCopyTip ||
              this.showVideoShareTip
            ) {
              return;
            }
            if (!this.isShowCheckBox) {
              this.goVideoPreview(curItem);
            }
          } else if (eventName === 'longTap') {
            this.curId = curItem.id;
            this.showShareTip = false;
            this.showLinkCopyTip = false;
            this.showVideoShareTip = tmpShowTip;
          }
          break;
        case 4:
          if (eventName === 'tap') {
            if (
              this.showShareTip ||
              this.showLinkCopyTip ||
              this.showVideoShareTip
            ) {
              return;
            }
            if (!this.isShowCheckBox) {
              AKJS.page.open(curItem.content, { type: 0 });
            }
          } else if (eventName === 'longTap') {
            this.curId = curItem.id;
            this.showShareTip = false;
            this.showVideoShareTip = false;
            this.showLinkCopyTip = tmpShowTip;
          }
          break;
        default:
          break;
      }
    },
    // 分享处理逻辑
    handleShare(curItem) {
      const { id, type } = curItem;
      switch (Number(type)) {
        case 2:
          {
            this.showShareTip = false;
            this.isShowCheckBox = true;
            const newList = this.list.map(item => {
              if (item.id === id) {
                item.selected = true;
              }
              return item;
            });
            this.list = newList;
            this.selectNum = 1;
          }
          break;
        case 3:
          this.showVideoShareTip = false;
          AKJS.action.dispatch('event.share.video', {
            video: curItem.filename
          });
          break;
        default:
          break;
      }
    },
    // 复制处理逻辑
    handleCopy(curItem) {
      const { content, type } = curItem;
      this.$copyText(content)
        .then(() => {
          switch (Number(type)) {
            case 4:
              this.showLinkCopyTip = false;
              break;
            default:
              break;
          }
          this.$toast('已成功复制,可直接去粘贴');
        })
        .catch(() => {
          this.$toast('复制失败');
        });
    },
    // 图片分享选择处理逻辑
    selectShareContent(id) {
      let selectCount = 0;
      this.list.forEach(item => {
        if (item.selected) {
          selectCount += 1;
        }
      });
      // 限制最多只能选择9张图
      if (selectCount >= this.maxNum) {
        this.selectNum = selectCount;
        this.$toast('最多只能选择9张图');
        return;
      }
      // 更改选中的状态
      const newList = this.list.map(item => {
        if (item.id === id) {
          item.selected = !item.selected;
        }
        return item;
      });
      // 过滤已选中数据，获取选中数量
      const filterList = newList.filter(item => item.selected);
      this.selectNum = filterList.length;
      this.list = newList;
    },
    // 单张图片分享
    picShared(index) {
      const imgUrl = this.images[index];
      AKJS.action.dispatch('event.share.images', { images: [imgUrl] });
    },
    // 单张图片下载
    picDownload(index) {
      const _this = this;
      AKJS.media
        .savePhoto({ webUrl: this.images[index] })
        .then(() => {
          _this.$app.device().then(res => {
            if (res.data.systemType === 'android') {
              Toast.success('图片下载成功');
            }
          });
        })
        .catch(() => {
          Toast.fail('图片下载失败');
        });
    },
    // 多张图片分享
    handleBottomShared() {
      const filterList = this.list.filter(
        item => item.type === 2 && item.selected
      );
      if (filterList.length <= 0) {
        return;
      }
      const imgs = filterList.map(item => {
        return item.filename;
      });
      AKJS.action.dispatch('event.share.images', { images: imgs }).then(() => {
        // 调用分享成功后清选择的数据
        this.clearListSelectStatus();
      });
    },
    // 预览视频
    goVideoPreview(data) {
      AKJS.media.playVideo({
        url: data.filename,
        playMode: 0 // 自动播放
      });
    },
    onChange(index) {
      this.index = index;
      this.showIndexNum = index + 1;
    },
    goPreviewPage(curItem) {
      const filterList = this.list.filter(item => item.type === 2);
      if (filterList.length > 0) {
        const index = filterList.findIndex(item => item.id === curItem.id);
        this.images = filterList.map(item => item.filename);
        this.index = index;
        this.showIndexNum = index + 1;
        this.show = true;
      }
    },
    // 清除图片选择框的展示，以及数据展示
    clearListSelectStatus() {
      this.isShowCheckBox = false;
      this.list = this.list.map(item => {
        if (item.type === 2) {
          item.selected = false;
        }
        return item;
      });
    },
    handleTop() {
      this.showLinkCopyTip = false;
      this.showShareTip = false;
      this.showVideoShareTip = false;
      if (this.isShowCheckBox) {
        this.clearListSelectStatus();
      }
    },
    close() {
      this.show = false;
    }
  },
  created() {
    this.firstLoading = true;
    this.$loading.show();
    this.fetchList();
  },
  mounted() {
    const _this = this;
    const wrapper = document.getElementById('wrapper');
    wrapper.addEventListener(
      'scroll',
      function(e) {
        const { scrollTop } = this;
        const { scrollHeight } = this;
        const { clientHeight } = this;
        if (clientHeight + scrollTop >= scrollHeight && !_this.isShowCheckBox) {
          if (!_this.isLoading) {
            _this.isLoading = true;
            _this.$loading.show();
            _this.onLoad();
          }
        }
      },
      false
    );

    this.wrapper = wrapper;
  },
  destroyed() {
    const _this = this;
    this.wrapper.removeEventListener('scroll', function() {
      _this.isLoading = false;
    });
  }
};
</script>

<style lang="scss" scoped>
.list-content {
  width: 100%;
  position: relative;
  background: #f6f6f6;
  height: 100vh;
  padding-bottom: 60px;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;

  /*解决ios端长按问题*/
  img,
  a {
    -webkit-touch-callout: none;
  }

  .date-wrap {
    text-align: center;

    span {
      background: #cdcdcd;
      display: inline-block;
      color: #fff;
      padding: 2px 4px;
      font-size: 0.2rem;
    }
  }

  .list-item {
    display: flex;
    padding: 10px 10px 10px;
    /*align-items: center;*/

    .avatar-img {
      width: 0.84rem;
      vertical-align: top;
    }

    .content-wrap {
      font-size: 0.2rem;
      margin-left: 10px;

      .content-title {
        margin-left: 2px;
        color: #6d6d78;
        font-size: 0.2rem;
      }

      .text-type-wrap {
        position: relative;
        margin-top: 2px;

        .tooltip-text {
          background-color: black;
          color: #fff;
          text-align: center;
          border-radius: 5px;
          padding: 5px 10px;
          /* 定位 */
          position: absolute;
          top: -30px;
          z-index: 1;
        }

        .tooltip-text::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: black transparent transparent transparent;
        }

        .text-wrap {
          max-width: 4.6rem;
          min-height: 0.3rem;
          position: relative;
          border-radius: 6px;
          padding: 4px 12px;
          color: #2a2a2a;
          font-size: 0.3rem;
          background-color: white;
          word-wrap: break-word;
        }

        .text-wrap::after {
          content: '';
          position: absolute;
          top: 12px;
          right: 100%;
          margin-top: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: transparent white transparent transparent;
        }

        .img-wrap {
          height: 3rem;

          img {
            height: 100%;
            max-width: 4rem;
            object-fit: cover;
          }
        }

        .video-wrap {
          height: 3rem;
          position: relative;

          .video {
            height: 100%;
            max-width: 4rem;
            object-fit: cover;
          }

          .play-video-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }

  .pic-preview-wrap {
    position: relative;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    .close-wrap {
      position: fixed;
      top: 0;
      left: 14px;
      z-index: 10000;
    }

    .share-wrap {
      position: fixed;
      top: 0;
      right: 14px;
      z-index: 10002;
    }

    .download-wrap {
      position: fixed;
      bottom: 0;
      right: 14px;
      z-index: 10004;
    }

    .preview-bg {
      background: #000;
    }
  }

  .bottom-share {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 0;

    img {
      width: 0.4rem;
      margin-right: 6px;
    }

    span {
      color: #2a2a2a;
      font-size: 0.3rem;
    }
  }
}
</style>
