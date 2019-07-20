import { resolve } from 'path';

const IS_PROD = process.env.NODE_ENV === 'production';
const cdnDomain = 'http://ply4cszel.bkt.clouddn.com';

module.exports = {
  publicPath: IS_PROD ? cdnDomain : '/', //
  outputDir: 'dist',
  chainWebpack: config => {
    // 这里是对环境的配置，不同环境对应不同的BASE_URL，以便axios的请求地址不同
    config.plugin('define').tap(args => {
      args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL);
      return args;
    });
    // #region 忽略生成环境打包的文件
    // const externals = {
    //   vue: 'Vue',
    //   axios: 'axios',
    //   'vue-router': 'VueRouter',
    //   vuex: 'Vuex',
    //   vant: 'Vant',
    // }
    // config.externals(externals)
    // const cdn = {
    //   css: [
    //     // vant css
    //     'https://cdn.jsdelivr.net/npm/vant@2.0.9/lib/index.css',
    //   ],
    //   js: [
    //     // vue
    //     '//cdn.staticfile.org/vue/2.6.10/vue.min.js',
    //     // vue-router
    //     '//cdn.staticfile.org/vue-router/3.0.7/vue-router.min.js',
    //     // vuex
    //     '//cdn.staticfile.org/vuex/3.1.1/vuex.min.js',
    //     // axios
    //     '//cdn.staticfile.org/axios/0.19.0/axios.min.js',
    //     // vant
    //     'https://cdn.jsdelivr.net/npm/vant@2.0.9/lib/vant.min.js',
    //   ]
    // }
    // config.plugin('html')
    //   .tap(args => {
    //     args[0].cdn = cdn
    //     return args
    //   })
    // #endregion
    config.resolve.alias.set('@', resolve('src'));
  }
  // css: {
  //   loaderOptions: {
  //     sass: {
  //       // data: `@import "~@/styles/variables.scss";`
  //     }
  //   }
  // }
};
