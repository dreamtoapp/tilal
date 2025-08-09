export interface LoggingConfig {
  debug: boolean;
  info: boolean;
  warn: boolean;
  error: boolean;
  log: boolean;
}

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

export const loggingConfig: LoggingConfig = {
  debug: isDevelopment,
  info: isDevelopment || isProduction,
  warn: true,
  error: true,
  log: isDevelopment,
};

export const shouldLog = (level: keyof LoggingConfig): boolean => {
  return loggingConfig[level];
};
