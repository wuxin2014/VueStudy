import Vue from 'vue';
// eslint-disable-next-line import/extensions
import Loading from '../components/loading';

const VueLoading = Vue.extend(Loading);

VueLoading.prototype.close = function() {
  this.hide();
};

function $loading() {
  console.log('====');
  let loading = null;
  // 第一次调用
  if (!loading) {
    loading = new VueLoading();
    // 手动创建一个未挂载的实例
    loading.$mount();

    // 等价于上面两行代码
    /* loading = new VueLoading({
      el: document.createElement('div'),
    }); */

    // 挂载
    document.querySelector('body').appendChild(loading.$el);
  }

  loading.show();
  return loading;
}

export default {
  // eslint-disable-next-line no-shadow
  install(Vue) {
    console.log('====install');
    // eslint-disable-next-line no-multi-assign
    Vue.loading = Vue.prototype.$loading = $loading;
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.prototype.$loading = $loading;
}
