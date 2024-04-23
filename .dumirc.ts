import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  resolve: {
    atomDirs: [
      { type: 'component', dir: 'packages/antd' },
      { type: 'hook', dir: 'packages/hooks' },
    ],
    entryFile: './packages/index.ts',
  },
  themeConfig: {
    name: '组件库',
    nav: [
      { title: '组件', link: '/components/demo' },
      { title: 'Hooks', link: '/hooks/use-fetch' },
    ],
  },
  // 开启 apiParser
  apiParser: {},
  // 无效
  monorepoRedirect: {
    srcDir: ['src'],
    peerDeps: true,
  },
  // 实现在 md 文件中引用 @zl/*
  alias: {
    '@zl/antd': require.resolve('./packages/antd'),
    '@zl/hooks': require.resolve('./packages/hooks'),
    '@zl/utils': require.resolve('./packages/utils'),
  },
});
