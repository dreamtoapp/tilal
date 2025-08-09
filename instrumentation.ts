export async function register(): Promise<void> {
  // Disable verbose console output in production (or when explicitly disabled via env var).
  // This runs once when the Next.js server starts thanks to the `instrumentation.ts` feature.
  if (process.env.NODE_ENV === 'production' || process.env.DISABLE_SERVER_LOGS === 'true') {
    /* eslint-disable @typescript-eslint/no-empty-function */
    const noop = (): void => {};
    // Silence less-critical console methods while keeping `error` & `warn` visible.
    console.log = noop;
    console.info = noop;
    console.debug = noop;
    /* eslint-enable @typescript-eslint/no-empty-function */
  }
} 