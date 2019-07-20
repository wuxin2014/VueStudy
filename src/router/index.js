import Vue from 'vue';
import VueRouter from 'vue-router';
// eslint-disable-next-line import/extensions
import Home from '../views/Home';
// eslint-disable-next-line import/extensions
import Test from '../views/Test';

Vue.use(VueRouter);

const routes = new VueRouter({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/test',
      component: Test
    }
  ]
});

export default routes;
