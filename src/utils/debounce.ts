export function debounce<F extends Function>(fn: F, delay = 300): F {
  let timeoutId: number;

  return <any>function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
