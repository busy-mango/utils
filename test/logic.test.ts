import { describe, expect, it } from 'vitest';

import { isString } from '@busymango/is-esm';

import { and, ifnot, or, sizeOf } from '../src/logic';

describe('and', () => {
  it('should return true if all elements satisfy the predicate', () => {
    const source = [1, 2, 3, 4];
    const predicate = (value: number) => value > 0;
    expect(and(source, predicate)).toBeTruthy();
  });

  it('should return false if any element does not satisfy the predicate', () => {
    const source = [1, 2, 3, 4];
    const predicate = (value: number) => value > 2;
    expect(and(source, predicate)).toBeFalsy();
  });

  it('should return false if the source array is empty', () => {
    const source: number[] = [];
    const predicate = (value: number) => value > 0;
    expect(and(source, predicate)).toBeFalsy();
  });
});

describe('or', () => {
  it('should return true if any element satisfies the predicate', () => {
    const source = [1, 2, 3, 4];
    const predicate = (value: number) => value > 2;
    expect(or(source, predicate)).toBeTruthy();
  });

  it('should return false if no element satisfies the predicate', () => {
    const source = [1, 2, 3, 4];
    const predicate = (value: number) => value > 5;
    expect(or(source, predicate)).toBeFalsy();
  });

  it('should return false if the source array is empty', () => {
    const source: number[] = [];
    const predicate = (value: number) => value > 0;
    expect(or(source, predicate)).toBeFalsy();
  });
});

describe('ifnot', () => {
  it('should return the source value if it is not false', () => {
    const res1 = ifnot(123);
    expect(res1).toBe(123);
    const res2 = ifnot(isString('1') && 123);
    expect(res2).toBe(123);
  });

  it('should return the placeholder value if the source is false', () => {
    const source = false;
    const placeholder = 'placeholder';
    const res = ifnot(source, placeholder);
    expect(res).toBe('placeholder');
  });

  it('should return undefined if the source is false and no placeholder is provided', () => {
    const res = ifnot(false);
    expect(res).toBeUndefined();
  });

  it('should return the source value if it is not false, even if the placeholder is provided', () => {
    const source = 'value';
    const placeholder = 'placeholder';
    const res = ifnot(source, placeholder);
    expect(res).toBe('value');
  });
});

describe('sizeOf function', () => {
  it('should return the length of an array', () => {
    expect(sizeOf([1, 2, 3])).toBe(3);
  });

  it('should return the length of a string', () => {
    expect(sizeOf('hello')).toBe(5);
  });

  it('should return the size of a Map', () => {
    const map = new Map([
      [1, 'one'],
      [2, 'two'],
    ]);
    expect(sizeOf(map)).toBe(2);
  });

  it('should return the size of a Set', () => {
    const set = new Set([1, 2, 3, 3, 4]);
    expect(sizeOf(set)).toBe(4);
  });

  it('should return the number of keys in a plain object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(sizeOf(obj)).toBe(3);
  });

  it('should return 0 for unsupported types', () => {
    expect(sizeOf(null)).toBe(0);
    expect(sizeOf(undefined)).toBe(0);
    expect(sizeOf(123)).toBe(0);
    expect(sizeOf(true)).toBe(0);
    expect(sizeOf(Symbol())).toBe(0);
  });
});
