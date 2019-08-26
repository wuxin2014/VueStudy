import Vue from 'vue';
import { Button, Loading, ImagePreview, Lazyload, Icon } from 'vant';
import router from './router';
import App from './App.vue';
import loading from './plugins/loading';
import './index.css';
import 'vant/lib/index.css';

Vue.use(Button)
  .use(Loading)
  .use(ImagePreview)
  .use(Lazyload)
  .use(Icon);

Vue.use(loading);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
