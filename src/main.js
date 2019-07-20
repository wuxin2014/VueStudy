import Vue from 'vue';
import { Button, Loading } from 'vant';
import router from './router';
import App from './App.vue';
import loading from './plugins/loading';

import 'vant/lib/index.css';

Vue.use(Button).use(Loading);
Vue.use(loading);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
