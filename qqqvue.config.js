import path, { resolve } from 'path';

// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const IS_PROD = process.env.NODE_ENV === 'production';
const cdnDomain = 'http://ply4cszel.bkt.clouddn.com';

module.exports = {
  publicPath: IS_PROD ? cdnDomain : '/', //
  outputDir: 'dist',
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 修改打包后js文件名
      config.output = {
        path: path.join(__dirname, './dist'),
        filename: 'js/[name].[contenthash:8].js'
      };
      // 修改打包后css文件名
      // config.plugins = [
      //   new MiniCssExtractPlugin({
      //     filename: `css/[name].[contenthash:8].css`
      //   })
      // ];
    }
  },
  chainWebpack: config => {
    // 这里是对环境的配置，不同环境对应不同的BASE_URL，以便axios的请求地址不同
    config.plugin('define').tap(args => {
      args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL);
      return args;
    });
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 }));
    // if (process.env.NODE_ENV === 'production') {
    //   config.plugin('extract-css').tap(() => [
    //     {
    //       path: path.join(__dirname, './dist'),
    //       filename: 'css/[name].[contenthash:8].css'
    //     }
    //   ]);
    // }
    if (process.env.NODE_ENV === 'production') {
      config.plugin('uglify').tap(([options]) => {
        // 去除 console.log
        return [
          Object.assign(options, {
            uglifyOptions: {
              compress: {
                drop_console: true,
                pure_funcs: ['console.log']
              }
            }
          })
        ];
      });
    }
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
  },
  css: {
    modules: true, // default: true
    loaderOptions: {
      css: {
        localIdentName: '[name]-[hash]',
        camelCase: 'only'
      }
      // 配置在移动端以[640,750]方式来处理rem的基本代码体
      // postcss: {
      //   plugins: [require('postcss-px2rem')({
      //     remUnit: 75
      //   })]
      // }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: '',
        ws: true,
        changeOrigin: true
      }
    }
  }
};
