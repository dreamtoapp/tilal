import { shouldLog } from './logging-config';

// Enhanced logger functions with environment-based filtering
export const log = (...args: any[]) => {
  if (shouldLog('log')) {
    console.log(...args);
  }
};

export const debug = (...args: any[]) => {
  if (shouldLog('debug')) {
    console.log('[DEBUG]', ...args);
  }
};

export const info = (...args: any[]) => {
  if (shouldLog('info')) {
    console.info('[INFO]', ...args);
  }
};

export const warn = (...args: any[]) => {
  if (shouldLog('warn')) {
    console.warn('[WARN]', ...args);
  }
};

export const error = (...args: any[]) => {
  if (shouldLog('error')) {
    console.error('[ERROR]', ...args);
  }
}; 