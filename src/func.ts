import type { ConstrainedFunc } from './types';

type ClosureType<T extends ConstrainedFunc<T>> = {
  timer: number;
  scale: number;
  that?: unknown;
  args?: Parameters<T>;
};

export type CallParams = {
  /** Controls if the function should be invoked on the leading edge of the timeout */
  leading?: boolean;
  /** Controls if the function should be invoked on the trailing edge of the timeout */
  trailing?: boolean;
};

/**
 * Before using this method, please ensure that you understand whether the implementation of this method meets your requirements.
 */
export const debounce = <T extends ConstrainedFunc<T>>(func: T, wait = 300) => {
  const closure: ClosureType<T> = {
    timer: 0,
    scale: Date.now(),
  };

  const cancel = () => {
    const { timer } = closure;
    cancelAnimationFrame(timer);
  };

  const flush = () => {
    cancel();
    const { that = this } = closure;
    return func.apply(that, closure.args!);
  };

  function starer(this: unknown, ...args: Parameters<T>): void | ReturnType<T> {
    cancel();
    closure.args = args;
    closure.that = this;
    const timestamp = Date.now();
    if (closure.scale < timestamp) {
      closure.scale = timestamp + wait;
    }

    if (closure.scale > timestamp) return flush();
    closure.timer = requestAnimationFrame(() => {
      starer(...args);
    });
  }

  return { cancel, starer, flush };
};
