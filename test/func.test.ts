// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';

import { sleep } from '../src/async';
import { debounce } from '../src/func';

describe('debounce', () => {
  it('the debounce func should run success', async () => {
    const closure = {
      count: 0,
    };

    const debounced = debounce((value: number = 0) => {
      closure.count += value;
    }, 300);

    debounced.starer(2);
    debounced.starer(2);
    debounced.starer(2);
    debounced.starer(2);

    await sleep(400);

    expect(closure.count).toBe(2);

    debounced.starer(2);
    debounced.starer(2);
    debounced.starer(2);
    debounced.starer(2);

    await sleep(400);

    expect(closure.count).toBe(4);
  });
  it('the func run only lastone', async () => {
    const closure = {
      count: 0,
    };

    const debounced = debounce((value: number = 0) => {
      closure.count++;
      return 2 * value;
    }, 400);

    debounced.starer(2);
    debounced.starer(4);
    debounced.starer(6);
    debounced.starer(8);
    debounced.starer(16);

    await sleep(400);
    expect(closure.count).toBe(1);
    expect(debounced.flush()).toBe(32);
  });
  it('the object this must extends', async () => {
    const number = 2;
    const debounced = debounce(function (this: number) {
      return this * 2;
    });
    debounced.starer.bind(number)();
    expect(debounced.flush()).toBe(4);
  });
});
