import { ConstrainedFunc } from "./types";

type ClosureType<T extends ConstrainedFunc<T>> = {
  timer: number;
  scale: number;
  this?: unknown;
  args?: Parameters<T>;
}

export type CallParams = {
  /** Controls if the function should be invoked on the leading edge of the timeout */
  leading?: boolean;
  /** Controls if the function should be invoked on the trailing edge of the timeout */
  trailing?: boolean;
}

/** 
 * @deprecated This method is not recommended for general use.
 * Before using this method, please ensure that you understand whether the implementation of this method meets your requirements.
 */
export const debounce = <
  T extends ConstrainedFunc<T>
>(func: T, wait = 300) => {
  const closure: ClosureType<T> = {
    timer: 0,
    scale: Date.now(),
  }

  const cancel = () => {
    const { timer } = closure;
    cancelAnimationFrame(timer);
  }

  const flush = () => {
    cancel();
    const { this: that } = closure;
    return func.apply(that, closure.args!);
  }

  function starer(this: unknown, ...args: Parameters<T>) {
    cancel();
    closure.args = args;
    closure.this = this;
    const timestamp = Date.now();
    if (closure.scale < timestamp) {
      closure.scale = timestamp + wait;
    }
    
    closure.timer = requestAnimationFrame(() => {
      const isRunTime = closure.scale > timestamp;
      isRunTime ? flush() : starer(...args);
    });
  }

  return { cancel, starer, flush };
};
