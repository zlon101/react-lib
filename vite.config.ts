import * as path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const NODE_ENV = process.env.NODE_ENV; // development production
const pathResolve = _path => path.resolve(__dirname, _path);
const IsLog = true; // 是否输出调试log
const log = (...args) => IsLog && console.log(...args);

log(`\n🚀 node version:${process.version}, ${NODE_ENV} 环境`);

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // '@pages': pathResolve('./src/pages'),
      // '@cmp': pathResolve('./src/components'),
      '@': pathResolve('./src'),
      '@utils': pathResolve('./src/utils'),
      '@test': pathResolve('./src/test'),
    },
  },
  optimizeDeps: {
    include: ['src/utils/crypto-js', '@utils/crypto-js'],
  },
});
