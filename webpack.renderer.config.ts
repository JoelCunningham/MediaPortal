import path from 'path';
import type { Configuration } from 'webpack';
import { plugins } from './webpack.plugins';
import { rules } from './webpack.rules';

rules.push({
  test: /\.css$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    { loader: 'postcss-loader' }
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@models': path.resolve(__dirname, 'src/models'),
      '@objects': path.resolve(__dirname, 'src/objects'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@repositories': path.resolve(__dirname, 'src/repositories'),
      '@services': path.resolve(__dirname, 'src/services'),
    }
  },
};
