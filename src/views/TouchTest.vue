<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="list-content" @click="handleTop">
    <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
      <van-list
        v-model="isLoading"
        :finished="finished"
        :offset="offset"
        :immediate-check="false"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div v-for="item in list" :key="item.id" class="list-item">
          <!-- 选择框 -->
          <div
            style="margin-right: 10px"
            v-if="item.type === 2 && isShowCheckBox === true"
            @click="selectShareContent(item.id)"
          >
            <van-icon
              name="checked"
              size="26px"
              v-if="item.selected"
              color="dodgerblue"
            />
            <van-icon v-else name="checked" size="26px" color="#cdcdcd" />
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
            <div style="margin-left: 2px; color: #6D6D78;">
              <span>{{ item.materialName }}</span>
              <span>{{ `(${item.materialNo})` }}</span>
            </div>
            <!-- 根据类型展示 -->
            <!-- 纯文本 -->
            <div class="text-type-wrap" v-if="item.type === 1">
              <span
                class="tooltip-text"
                v-show="showCopyTip && item.id === curId"
                @click.stop="handleCopy(item)"
                >复制</span
              >
              <div
                class="text-wrap"
                v-longtap="e => vueTouch(item, 'longTap', e)"
              >
                {{ item.content }}
              </div>
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
                v-tap="e => vueTouch(item, 'tap', e)"
                v-longtap="e => vueTouch(item, 'longTap', e)"
              >
                <!--                                <video-->
                <!--                                    ref="video"-->
                <!--                                    :poster="poster"-->
                <!--                                    :src="item.filename"-->
                <!--                                    class="video"-->
                <!--                                    x-webkit-airplay="true"-->
                <!--                                    playsinline="true"-->
                <!--                                    webkit-playsinline="true"/>-->
                <img v-lazy="poster" class="video" />
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
                v-longtap="e => vueTouch(item, 'longTap', e)"
              >
                <a style="text-decoration: underline; color: dodgerblue;">{{
                  item.content
                }}</a>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <!-- 图片预览 -->
    <div class="pic-preview-wrap" v-if="show">
      <div class="share-wrap" @click="picShared">
        <img
          src="../../common/images/material/share.png"
          width="30"
          alt="pic"
        />
      </div>
      <div class="download-wrap" @click="picDownload">
        <img
          src="../../common/images/material/download.png"
          width="30"
          alt="pic"
        />
      </div>
      <van-image-preview
        className="preview-bg"
        v-model="show"
        :images="images"
        @change="onChange"
      >
        <template v-slot:index>
          <span>第{{ showIndexNum }}页</span>
        </template>
      </van-image-preview>
    </div>
    <!-- 底部分享按钮 -->
    <div class="bottom-share" v-if="isShowCheckBox" @click="handleBottomShared">
      <img src="../../common/images/material/share-bottom.png" alt="pic" />
      <span>{{ `分享(${selectNum}/9)` }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'touch',
  data() {
    return {
      list: [],
      // 最多选择图片数量
      maxNum: 9,
      selectNum: 0,

      isLoading: false, // 上拉加载
      isRefreshing: false, // 下拉刷新
      finished: false, // 上拉加载完毕
      offset: 10, // 滚动条与底部距离小于 offset 时触发load事件
      hasNext: true,
      pageIndex: 1,
      pageSize: 3,

      show: false,
      index: 0,
      images: [],
      showIndexNum: 1,

      curId: '',
      showCopyTip: false,
      showShareTip: false,
      showLinkCopyTip: false,
      showVideoShareTip: false,
      isShowCheckBox: false,
      timeOutEvent: 0,

      poster:
        'http://www.agri35.com/UploadFiles/img_0_3134292824_2943086564_26.jpg',
      firstLoading: null
    };
  },
  methods: {
    // 下拉刷新
    onRefresh() {
      this.curId = '';
      this.selectNum = 0;
      this.isShowCheckBox = false;

      this.pageIndex = 1;
      this.isLoading = false;
      this.isLoading = false; // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
      this.isRefreshing = true;
      this.fetchList();
    },
    // 上拉加载
    onLoad() {
      this.fetchList();
    },
    // 获取列表数据
    fetchList() {
      this.$materail
        .getMaterialList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
        .then(res => {
          let { data } = res;
          data = data || {};
          const resList = data.result || [];
          let newResList = [];

          resList.forEach(dataItem => {
            let { materials } = dataItem;
            const { materialName } = dataItem;
            materials = materials || [];
            if (materials.length > 0) {
              materials = materials.map(item => {
                item.materialName = materialName;
                if (item.type === 2 || item.type === 3) {
                  item.content = JSON.parse(item.content);
                }
                return item;
              });
              materials = materials.sort((a, b) => a.sequence - b.sequence);

              materials.forEach(item => {
                if (item.type === 1 || item.type === 4) {
                  newResList.push(item);
                }
                if (item.type === 2 || item.type === 3) {
                  const { content, ...rest } = item;
                  console.log('content==', content);
                  const newContentData = content.map(conItem => {
                    return { ...conItem, ...rest, id: conItem.filename };
                  });
                  console.log('newContentData===', newContentData);
                  newResList = newResList.concat(newContentData);
                }
              });
              console.log('newResList===', newResList);
            }
          });
          if (this.pageIndex === 1) {
            this.list = newResList;
            setTimeout(() => {
              this.isRefreshing = false;
            }, 1000);
          } else {
            this.list = this.list.concat(newResList);
            setTimeout(() => {
              this.isLoading = false;
            }, 2000);
          }

          const pages = res.data.pages || 0;
          const hasNext = this.pageIndex < pages;
          if (!hasNext) {
            setTimeout(() => {
              this.finished = true;
            }, 1000);
          }
          this.hasNext = hasNext;
          this.pageIndex += 1;
        })
        .catch(() => {
          this.isRefreshing = false;
          this.isLoading = false;
          this.$toast('请求失败，请重试');
        })
        .finally(() => {
          if (this.firstLoading) {
            this.firstLoading.close();
            this.firstLoading = null;
          }
        });
    },
    // @touchstart.prevent="handleTouchStart(item)"
    // @touchend.prevent="handleTouchEnd(item)"
    // 长按显示tip逻辑
    handleTouchStart(curItem) {
      clearInterval(this.timeOutEvent); // 再次清空定时器，防止重复注册定时器
      this.timeOutEvent = setTimeout(
        function() {
          this.curId = curItem.id;
          this.timeOutEvent = 0;
          const tmpShowTip = !this.isShowCheckBox;
          switch (Number(curItem.type)) {
            case 1:
              this.showLinkCopyTip = false;
              this.showShareTip = false;
              this.showVideoShareTip = false;
              this.showCopyTip = tmpShowTip;
              break;
            case 2:
              this.showLinkCopyTip = false;
              this.showCopyTip = false;
              this.showVideoShareTip = false;
              this.showShareTip = tmpShowTip;
              break;
            case 3:
              this.showCopyTip = false;
              this.showShareTip = false;
              this.showLinkCopyTip = false;
              this.showVideoShareTip = tmpShowTip;
              break;
            case 4:
              this.showCopyTip = false;
              this.showShareTip = false;
              this.showVideoShareTip = false;
              this.showLinkCopyTip = tmpShowTip;
              break;
            default:
              break;
          }
        }.bind(this),
        1000
      );
    },
    //
    handleTouchEnd(curItem) {
      clearInterval(this.timeOutEvent);
      // 模拟点事件逻辑处理
      switch (Number(curItem.type)) {
        case 2:
          if (
            this.showVideoShareTip ||
            this.showCopyTip ||
            this.showLinkCopyTip
          ) {
            this.timeOutEvent = 0;
            return;
          }
          if (!this.showShareTip && this.timeOutEvent !== 0) {
            this.timeOutEvent = 0;
            this.goPreviewPage();
          }
          break;
        case 3:
          if (this.showCopyTip || this.showShareTip || this.showLinkCopyTip) {
            this.timeOutEvent = 0;
            return;
          }
          if (
            !this.showVideoShareTip &&
            !this.isShowCheckBox &&
            this.timeOutEvent !== 0
          ) {
            this.timeOutEvent = 0;
            this.goVideoPreview(curItem);
          }
          break;
        default:
          this.timeOutEvent = 0;
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
          // AKJS.action
          //   .dispatch('event.share.video', { video: curItem.filename })
          //   .then(res => {
          //     this.$toast(res);
          //   });
          break;
        default:
          break;
      }
    },
    // 复制处理逻辑
    handleCopy(curItem) {
      const { content, type } = curItem;
      console.log(content, type);
      // this.$copyText(content)
      //   .then(() => {
      //     switch (Number(type)) {
      //       case 1:
      //         this.showCopyTip = false;
      //         break;
      //       case 4:
      //         this.showLinkCopyTip = false;
      //         break;
      //       default:
      //         break;
      //     }
      //     this.$toast('已成功复制,可直接去粘贴');
      //   })
      //   .catch(() => {
      //     this.$toast('复制失败');
      //   });
    },
    // 图片分享选择处理逻辑
    selectShareContent(id) {
      let curNum = 0;
      this.list.forEach(item => {
        if (item.selected) {
          curNum += 1;
        }
      });
      // 限制最多只能选择9张图
      if (curNum >= this.maxNum) {
        this.selectNum = curNum;
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
    async picShared() {
      const imgUrl = this.images[this.index];
      console.log(imgUrl);
      // AKJS.action.dispatch('event.share.images', { images: [imgUrl] });
    },
    // 单张图片下载
    picDownload() {
      // AKJS.media
      //   .savePhoto({ webUrl: this.images[this.index] })
      //   .then(() => {
      //     Toast.success('图片下载成功');
      //   })
      //   .catch(() => {
      //     Toast.fail('图片下载失败');
      //   });
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
      console.log(imgs);
      // AKJS.action.dispatch('event.share.images', { images: imgs }).then(() => {
      //   // 调用分享成功后清选择的数据
      //   this.isShowCheckBox = false;
      //   this.list = this.list.map(item => {
      //     if (item.type === 2) {
      //       item.selected = false;
      //     }
      //     return item;
      //   });
      // });
    },
    goVideoPreview(data) {
      console.log(data);
      // AKJS.media.playVideo({
      //   url: data.filename,
      //   playMode: 1
      // })
    },
    onChange(index) {
      this.index = index;
      this.showIndexNum = index + 1;
    },
    goPreviewPage() {
      this.images = this.list
        .filter(item => item.type === 2)
        .map(item => item.filename);
      this.show = true;
    },
    handleTop() {
      this.showLinkCopyTip = false;
      this.showShareTip = false;
      this.showVideoShareTip = false;
      this.showCopyTip = false;
    },
    vueTouch(curItem, eventName) {
      this.curId = curItem.id;
      const tmpShowTip = !this.isShowCheckBox;
      switch (Number(curItem.type)) {
        case 2:
          if (eventName === 'tap') {
            if (
              this.showVideoShareTip ||
              this.showCopyTip ||
              this.showLinkCopyTip
            ) {
              this.timeOutEvent = 0;
              return;
            }
            if (!this.showShareTip) {
              this.goPreviewPage();
            }
          } else if (eventName === 'longTap') {
            this.showLinkCopyTip = false;
            this.showCopyTip = false;
            this.showVideoShareTip = false;
            this.showShareTip = tmpShowTip;
          }
          break;
        case 3:
          if (eventName === 'tap') {
            if (this.showCopyTip || this.showShareTip || this.showLinkCopyTip) {
              return;
            }
            if (!this.showVideoShareTip && !this.isShowCheckBox) {
              this.goVideoPreview(curItem);
            }
          } else if (eventName === 'longTap') {
            this.showCopyTip = false;
            this.showShareTip = false;
            this.showLinkCopyTip = false;
            this.showVideoShareTip = tmpShowTip;
          }
          break;
        case 1:
          this.showLinkCopyTip = false;
          this.showShareTip = false;
          this.showVideoShareTip = false;
          this.showCopyTip = tmpShowTip;
          break;
        case 4:
          this.showCopyTip = false;
          this.showShareTip = false;
          this.showVideoShareTip = false;
          this.showLinkCopyTip = tmpShowTip;
          break;
        default:
          break;
      }
    }
  },
  created() {
    this.firstLoading = this.$loading();
    this.fetchList();
  }
};
</script>

<style lang="scss" scoped>
.list-content {
  width: 100%;
  position: relative;
  background: #f6f6f6;
  height: 100vh;
  overflow: scroll;

  .list-item {
    display: flex;
    padding: 20px 10px 10px;
    align-items: center;

    .avatar-img {
      width: 0.84rem;
    }

    .content-wrap {
      font-size: 0.2rem;
      margin-left: 10px;

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
          position: relative;
          border-radius: 6px;
          padding: 4px 12px;
          color: #2a2a2a;
          font-size: 0.3rem;
          background-color: white;
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
          max-width: 2rem;

          img {
            background-size: contain;
            width: 100%;
          }
        }

        .video-wrap {
          width: 3rem;
          position: relative;
          /*border: 1px solid rgba(229,229,229,1);*/

          .video {
            width: 100%;
            background-size: contain;
            /*height: 100%;*/
            /*object-fit: fill;*/
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

    .share-wrap {
      position: fixed;
      top: 0;
      right: 14px;
      z-index: 10000;
    }

    .download-wrap {
      position: fixed;
      bottom: 0;
      right: 14px;
      z-index: 10001;
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
