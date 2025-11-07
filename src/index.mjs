import { configFactory } from './factory.mjs';
import { defineConfig } from 'eslint/config';

export default configFactory();

/** Re-exported defineConfig */
export const extendConfig = defineConfig;
