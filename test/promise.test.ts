import { describe, expect, it } from 'vitest';

import { isError } from '@busymango/is-esm';

import { retry, sleep } from '../src/promise';

describe('sleep function', () => {
  // 测试异步函数是否能正确延迟
  it('should delay for specified time', async () => {
    const startTime = Date.now();
    const delayTime = 1000; // 1秒
    await sleep(delayTime);
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    // 允许误差范围为 50 毫秒
    expect(elapsedTime).toBeGreaterThanOrEqual(delayTime - 50);
    expect(elapsedTime).toBeLessThanOrEqual(delayTime + 50);
  });

  // 测试是否能正确处理不同的延迟时间
  it('should delay for different times', async () => {
    const delayTimes = [500, 1000, 1500]; // 0.5秒, 1秒, 1.5秒
    const startTimes: number[] = [];
    const endTimes: number[] = [];

    for (const delayTime of delayTimes) {
      startTimes.push(Date.now());
      await sleep(delayTime);
      endTimes.push(Date.now());
    }

    for (let i = 0; i < delayTimes.length; i++) {
      const elapsedTime = endTimes[i] - startTimes[i];
      // 允许误差范围为 50 毫秒
      expect(elapsedTime).toBeGreaterThanOrEqual(delayTimes[i] - 50);
      expect(elapsedTime).toBeLessThanOrEqual(delayTimes[i] + 50);
    }
  });
});

describe('retry function', () => {
  it('should reject after retries with error', async () => {
    try {
      await retry((): Promise<string> => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Failed'));
          }, 10);
        });
      }, 3);
      throw new Error('Expected retry to fail');
    } catch (error) {
      expect(isError(error) && error.message).toStrictEqual('Failed');
    }
  });

  it('should resolve with successful result', async () => {
    expect(
      await retry((): Promise<string> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve('Success');
          }, 10);
        });
      }, 3)
    ).toStrictEqual('Success');
  });

  it('should retry the specified number of times before failing', async () => {
    const variable = { count: 0 };

    try {
      await retry((): Promise<string> => {
        return new Promise((_, reject) => {
          variable.count += 1;
          setTimeout(() => {
            reject(new Error('Failed'));
          }, 10);
        });
      }, 4);
    } catch (error) {
      expect(variable.count).toStrictEqual(4);
    }
  });
});
