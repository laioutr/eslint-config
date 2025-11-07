import { configFactory } from './factory.mjs';
import { defineConfig } from 'eslint/config';

export default configFactory();

/** Re-exported tseslint.config */
export const extendConfig = defineConfig;
