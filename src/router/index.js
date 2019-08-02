import Vue from 'vue';
import VueRouter from 'vue-router';
// eslint-disable-next-line import/extensions
import Home from '../views/Home';
// eslint-disable-next-line import/extensions
import BetterScrollDemo from '../views/BetterScrollDemo';
// eslint-disable-next-line import/extensions

Vue.use(VueRouter);

const routes = new VueRouter({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/test',
      component: BetterScrollDemo
    },
    {
      path: '/test2',
      component: BetterScrollDemo
    }
  ]
});

export default routes;
