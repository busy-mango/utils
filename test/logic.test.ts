import { describe, expect, it } from 'vitest';

import { and, ifnot, isEqual, or } from '../src/logic';

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
    const res = ifnot(123);
    expect(res).toBe(123);
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

describe('isEqual function', () => {
  const now = new Date();
  class Person {
    name: string;
    friends: Person[] = [];
    self?: Person;
    constructor(name: string) {
      this.name = name;
    }
  }
  const jake = new Person('jake');
  jake.self = jake;
  jake.friends = [jake, jake];
  const symbolKey = Symbol('symkey');
  const complex = {
    num: 0,
    str: '',
    boolean: true,
    unf: void 0,
    nul: null,
    obj: { name: 'object', id: 1, chilren: [0, 1, 2] },
    arr: [0, 1, 2],
    func() {
      console.log('function');
    },
    person: jake,
    date: new Date(0),
    ref: null as unknown,
    reg: new RegExp('/regexp/ig'),
    [symbolKey]: 'symbol',
  };

  complex.ref = complex;

  it('returns true for equal things', () => {
    expect(isEqual(0, 0)).toBeTruthy();
    expect(isEqual('a', 'a')).toBeTruthy();
    expect(isEqual(true, true)).toBeTruthy();

    expect(isEqual([], [])).toBeTruthy();
    expect(isEqual({}, {})).toBeTruthy();
    expect(isEqual(new RegExp(/a*s/), new RegExp(/a*s/))).toBeTruthy();

    const hello = Symbol('hello');
    expect(isEqual(hello, hello)).toBeTruthy();

    expect(isEqual(now, structuredClone(now))).toBeTruthy();

    expect(isEqual(complex, { ...complex })).toBeTruthy();

    expect(
      isEqual([complex, complex], [{ ...complex }, { ...complex }])
    ).toBeTruthy();
  });

  it('returns false for non-equal things', () => {
    expect(isEqual(0, 1)).toBeFalsy();
    expect(isEqual('a', 'b')).toBeFalsy();
    expect(isEqual(true, false)).toBeFalsy();

    expect(isEqual([], [1])).toBeFalsy();
    expect(isEqual({ z: 23 }, { z: 4 })).toBeFalsy();
    expect(isEqual({ z: 23 }, { a: 1, b: 2 })).toBeFalsy();
    expect(isEqual({ z: 23, a: 1 }, { a: 1, b: 2 })).toBeFalsy();
    expect(isEqual(now, new Date())).toBeFalsy();
    expect(isEqual(Symbol('hello'), Symbol('goodbye'))).toBeFalsy();
    expect(isEqual(new RegExp(/^http:/), new RegExp(/https/))).toBeFalsy();

    expect(isEqual(complex, { ...complex, num: 23 })).toBeFalsy();

    expect(
      isEqual([complex, complex], [{ ...complex }, { ...complex, ref: null }])
    ).toBeFalsy();
  });

  it('returns true for cross-referencing', () => {
    const a: { v?: unknown; u?: unknown } = {};
    const b = { v: a };
    a.v = b;

    expect(isEqual(a, b)).toBeTruthy();

    a.u = '1';
    expect(isEqual(a, b)).toBeFalsy();
  });
});
