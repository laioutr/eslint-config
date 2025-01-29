import { configFactory } from './factory.mjs';
import tseslint from 'typescript-eslint';

export default configFactory();

/** Re-exported tseslint.config */
export const extendConfig = tseslint.config;
