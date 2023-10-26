import { describe, expect, it } from 'vitest';
import { and, or, ifnot } from '../src/logic';

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
    const source = 123;
    expect(ifnot(source)).toBe(123);
  });

  it('should return the placeholder value if the source is false', () => {
    const source = false;
    const placeholder = 'placeholder';
    expect(ifnot(source, placeholder)).toBe('placeholder');
  });

  it('should return undefined if the source is false and no placeholder is provided', () => {
    const source = false;
    expect(ifnot(source)).toBeUndefined();
  });

  it('should return the source value if it is not false, even if the placeholder is provided', () => {
    const source = 'value';
    const placeholder = 'placeholder';
    expect(ifnot(source, placeholder)).toBe('value');
  });
});
