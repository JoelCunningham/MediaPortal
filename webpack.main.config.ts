import path from 'path';
import type { Configuration } from 'webpack';
import { plugins } from './webpack.plugins';
import { rules } from './webpack.rules';

export const mainConfig: Configuration = {
  entry: './src/index.ts',
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      '@api': path.resolve(__dirname, 'src/backend/api'),
      '@repositories': path.resolve(__dirname, 'src/backend/repositories'),
      '@routes': path.resolve(__dirname, 'src/backend/routes'),
      '@services': path.resolve(__dirname, 'src/backend/services'),
      '@collections': path.resolve(__dirname, 'src/common/collections'),
      '@models': path.resolve(__dirname, 'src/common/models'),
      '@utilities': path.resolve(__dirname, 'src/common/utilities'),
      '@components': path.resolve(__dirname, 'src/frontend/components'),
      '@contexts': path.resolve(__dirname, 'src/frontend/contexts'),
      '@layouts': path.resolve(__dirname, 'src/frontend/layouts'),
      '@pages': path.resolve(__dirname, 'src/frontend/pages'),
    }
  },
};
