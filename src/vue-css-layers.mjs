import { requireCssLayer } from './rules/require-css-layer.mjs';

export default [
  {
    plugins: {
      laioutr: { rules: { 'require-css-layer': requireCssLayer } },
    },
    files: ['**/*.vue'],
    rules: {
      'laioutr/require-css-layer': 'error',
    },
  },
];
