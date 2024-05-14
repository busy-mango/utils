import type { ConstrainedFunc } from './types';

type ClosureType<T extends ConstrainedFunc<T>> = {
  func?: T;
  timer: number;
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
  const closure: ClosureType<T> = { timer: 0 };

  const cancel = () => {
    clearTimeout(closure.timer);
  };

  const flush = () => {
    cancel();
    closure.func!();
  };

  function starer(this: unknown, ...args: Parameters<T>): void {
    cancel();
    closure.func = func.bind(this, ...args) as T;
    closure.timer = setTimeout(closure.func, wait);
  }

  return { cancel, starer, flush, func, params: { wait } };
};
