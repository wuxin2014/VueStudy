import Vue from 'vue';
import VueRouter from 'vue-router';
// eslint-disable-next-line import/extensions
import Home from '../views/Home';
// eslint-disable-next-line import/extensions
import pullRefreshDemo from '../views/pullRefreshDemo';

Vue.use(VueRouter);

const routes = new VueRouter({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/test',
      component: pullRefreshDemo
    }
  ]
});

export default routes;
