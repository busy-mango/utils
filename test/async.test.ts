import { describe, expect, it } from 'vitest';

import { sleep } from '../src/async';

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
