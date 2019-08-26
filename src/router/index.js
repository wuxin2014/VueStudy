import Vue from 'vue';
import VueRouter from 'vue-router';
// eslint-disable-next-line import/extensions
import Home from '../views/Home';
// eslint-disable-next-line import/extensions
import BetterScrollDemo from '../views/betterScroll/BetterScrollDemo';

Vue.use(VueRouter);

const routes = new VueRouter({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/test2',
      component: BetterScrollDemo
    }
  ]
});

export default routes;
