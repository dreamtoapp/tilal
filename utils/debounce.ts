export function debounce<T extends (value: string) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(args[0]), delay);
  };
}

// Specialized debounce for cart operations that return promises
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  
  return (...args: Parameters<T>): Promise<any> => {
    if (timer) clearTimeout(timer);
    
    return new Promise((resolve, reject) => {
      timer = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}
