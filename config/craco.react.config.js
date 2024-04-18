require('dotenv/config'); // 解决 Windows 上没有自动加载 .env https://github.com/dilanx/craco/issues/198
const path = require('path');
const { getPlugin, pluginByName, addPlugins } = require('@craco/craco');
// const CracoAntDesignPlugin = require('craco-antd');
const CracoLessPlugin = require('craco-less');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPluginName = require('html-webpack-plugin').name;
// const EslintWebpackPluginName = require('eslint-webpack-plugin').name;
const MiniCssExtractPluginName = require('mini-css-extract-plugin').name;
const CopyFileWebpackPlugin = require('./plugins/copy-file-webpack-plugin');
const parseThemeLessFile = require('./plugins/read-theme-less');

const NODE_ENV = process.env.NODE_ENV;
const AppSubject = process.env.REACT_APP_SUBJECT;
const IsDev = NODE_ENV === 'development';
const ISPro = NODE_ENV === 'production';
const IsAnalyzBundle = IsDev && false; // 不想分析时设置为 false
const pathResolve = _path => path.resolve(__dirname, _path);
const IsLog = true; // 是否输出调试log
const log = (...args) => IsLog && console.log(...args);

log(`\n🚀 ${NODE_ENV} 环境 - ${AppSubject} `);

const getSiteTitle = () => {
  let str = '领航 - 探真科技';
  switch (AppSubject) {
    case 'zgyd':
      str = '观安 - 容器安全';
      break;
    case 'daoke':
      str = 'DaoCloud Security Suite';
      break;
    case 'wangan':
      str = '容器安全检测平台';
      break;
    case 'miaoyun':
      str = '秒云云原生安全平台';
      break;
    case 'dft':
      str = '东方通';
      break;
    case 'xishu':
      str = '喜数 - 容器安全';
      break;
  }
  return str;
};

const CacheGroups = {
  react: {
    name: 'react',
    test: (module) => /react|redux/.test(module.context),
    chunks: 'all',
    priority: 10,
  },
  antd: {
    name: 'antd',
    test: (module) => /ant/.test(module.context),
    chunks: 'all',
    priority: 10,
  },
  rxjs: {
    name: 'rxjs',
    test: (module) => /rxjs/.test(module.context),
    chunks: 'async',
    priority: 10,
  },
  jquery: {
    name: 'jquery',
    test: (module) => /jquery|$/.test(module.context),
    chunks: 'async',
    priority: 10,
  },
  moment: {
    name: 'moment',
    test: (module) => /moment/.test(module.context),
    chunks: 'async',
    priority: 10,
  },
  bizcharts: {
    name: 'bizcharts',
    test: (module) => /bizcharts/.test(module.context),
    chunks: 'async',
    priority: 10,
  },
  lodash: {
    name: 'lodash',
    test: (module) => /lodash/.test(module.context),
    chunks: 'async',
    priority: 10,
  },
  d3: {
    name: 'd3',
    test: (module) => /d3/.test(module.context),
    chunks: 'async',
    priority: 10,
  },
  xlsx: {
    name: 'xlsx',
    test: (module) => /xlsx/.test(module.context),
    chunks: 'async',
    priority: 10,
  },
  commons: {
    name: 'commons',
    minChunks: 2,
    chunks: 'async',
    priority: 0,
    reuseExistingChunk: true,
    enforce: true,
  },
};

const coverAntdThemeVars = parseThemeLessFile(pathResolve('src/style/default.less'));
// 若因为本地文件缓存没有及时更新可以直接在这里修改
// coverAntdThemeVars['blue-6'] = 'blue';

module.exports = {
  // craco 的插件
  plugins: [
    /**************/
    {
      // https://4x-ant-design.antgroup.com/docs/react/use-with-create-react-app-cn
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: { '@primary-color': '#1DA57A' },
            modifyVars: coverAntdThemeVars,
            javascriptEnabled: true,
          },
        },
      },
    },
    /**************
      https://www.npmjs.com/package/craco-antd
      bug: antd 的less 样式优先级高与项目自定义的 antd 组件的样式优先级，所以放弃使用
    {
      //
      plugin: CracoAntDesignPlugin,
      options: {
        customizeThemeLessPath: path.join(__dirname, 'src/style/antd-custom-theme.less'),
        babelPluginImportOptions: {
          style: true, // css
        },
      },
    },****/
  ],
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // log(`=========== webpackConfig ================
      //   mode:${webpackConfig.mode}
      //   plugins:\n%o`,
      //   webpackConfig.plugins
      // );

      webpackConfig.output.filename = ISPro ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js';

      // === 修改内置rule  ===
      // 找到rule: sassRegex /\.(scss|sass)$/
      const rules = webpackConfig.module.rules.find(rule => rule.oneOf).oneOf || [];
      const sassRule = rules.find(_item => _item.test.source === '\\.(scss|sass)$');
      if (sassRule) {
        const sassResolve = sassRule.use.find(_item => (_item.loader || '').includes('resolve-url-loader'));
        // 重写 root 解决 scss 文件以绝对路径引用 public 图像
        sassResolve.options.root = paths.appPublic;
      } else {
        console.error('未匹配到 sass rule');
        exit();
      }

      const fileLoaderRule = webpackConfig.module.rules.find(rule => rule.oneOf);
      if (fileLoaderRule) {
        // 添加处理public目录文件的规则
        fileLoaderRule.oneOf.unshift({
          test: /public\/.*\.(jpg|jpeg|png|gif|eot|ttf|woff|woff2|cur|ani|pdf)$/,
          loader: 'file-loader',
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        });
      }

      // ======= 插件 ======
      // 内置了: HtmlWebpackPlugin InlineChunkHtmlPlugin InterpolateHtmlPlugin DefinePlugin MiniCssExtractPlugin WebpackManifestPlugin
      // 修改 HtmlWebpackPlugin title
      let pluginResult = getPlugin(
        webpackConfig,
        pluginByName(HtmlWebpackPluginName)
      );
      if (pluginResult.isFound) {
        pluginResult.match.userOptions.title = getSiteTitle();
      }
      // 修改 MiniCssExtractPlugin，解决scss文件order报错
      pluginResult = getPlugin(
        webpackConfig,
        pluginByName(MiniCssExtractPluginName)
      );
      if (pluginResult.isFound) {
        pluginResult.match.options.ignoreOrder = true;
      }

      // 新增插件
      const newAddPlugins = [
        new CopyFileWebpackPlugin(paths),
      ];
      // 添加 BundleAnalyzerPlugin
      IsAnalyzBundle &&  newAddPlugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888,
        openAnalyzer: true, // 构建完打开浏览器
        reportFilename: pathResolve(`analyzer/index.html`),
      }));
      addPlugins(webpackConfig, newAddPlugins);

      // exit();
      if (ISPro) {
        // ======== 排除外部依赖项 =====
        webpackConfig.externals = {
          jquery: {
            commonjs: 'jQuery',
            amd: 'jQuery',
            root: '$',
          },
          moment: 'moment',
          bizcharts: 'BizCharts',
          // 以下配置为BizCharts依赖的第三方库，需要同时提供
          react: 'React',
          'react-dom': 'ReactDOM',
        };

        // build optimization
        // 已经内置了: TerserPlugin CssMinimizerPlugin
        webpackConfig.optimization.splitChunks = {
          chunks: 'all',
          maxAsyncRequests: 10,
          maxInitialRequests: 5,
          cacheGroups: CacheGroups,
        };
      }
      return webpackConfig;
    },
    alias: {
      '@pages': pathResolve('src/screens'),
      '@cmp': pathResolve('src/components'),
      '@api': pathResolve('src/services/DataService.ts'),
    },
  },

  // https://github.com/facebook/create-react-app/issues/11860#issuecomment-1140417343
  // 解决 onAfterSetupMiddleware warn
  devServer: {
    client: {
      overlay: false,
    },
    port: 3000,
    proxy: {
      '/api': {
        // http://console2-test-cn.tensorsecurity.cn/
        // https://console-local02.tensorsecurity.cn/
        target: 'https://console-local02.tensorsecurity.cn/',
        changeOrigin: true,
        // pathRewrite: { '^/api': '' },
      },
    },
  },
  eslint: {
    // 报错太多，先关闭
    enable: false,
  },
};

function exit() {
  throw new Error('手动退出');
  process.exit(0);
}
