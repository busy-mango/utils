import { describe, expect, it } from 'vitest';
import { safe, parse } from '../src/parse';

describe('safe', () => {
  it('should wrap a callback function with error handling', () => {
    const callback = (a: number, b: number) => a + b;
    const safeCallback = safe(callback);

    expect(safeCallback(2, 3)).toEqual(5);
  });

  it('should return undefined if an error occurs in the callback function', () => {
    const callback = () => {
      throw new Error('Error occurred');
    };
    const safeCallback = safe(callback);

    expect(safeCallback()).toBeUndefined();
  });
});

describe('parse.json', () => {
  it('should parse a valid JSON string into the specified type', () => {
    const jsonString = '{"name":"John","age":25}';
    const parsedData = parse.json<{ name: string, age: number }>(jsonString);

    expect(parsedData).toEqual({ name: 'John', age: 25 });
  });

  it('should return undefined if an error occurs during JSON parsing', () => {
    const invalidJsonString = '{"name":"John","age":}';
    const parsedData = parse.json<{ name: string, age: number }>(invalidJsonString);

    expect(parsedData).toBeUndefined();
  });
});