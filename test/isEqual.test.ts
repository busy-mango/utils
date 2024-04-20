import { describe, expect, it } from 'vitest';

import type { PlainObject } from '@busymango/is-esm';

import { isEqual } from '../src/logic';

// TODO https://vscode.dev/github/lodash/lodash
describe('isEqual', () => {
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
    expect(isEqual(-0, +0)).toBeFalsy();
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

  it('should compare arrays with circular references', () => {
    const source1: unknown[] = [];
    const source2: unknown[] = [];
    source1.push(source1);
    source2.push(source2);
    expect(isEqual(source1, source2)).toBe(true);

    source1.push('b');
    source2.push('b');
    expect(isEqual(source1, source2)).toBe(true);

    source1.push('c');
    source2.push('d');
    expect(isEqual(source1, source2)).toBe(false);

    const source3: unknown[] = ['a', 'b', 'c'];
    const source4 = ['a', ['a', 'b', 'c'], 'c'];

    source3[1] = source3;

    expect(isEqual(source3, source4)).toBe(false);
  });

  it('should have transitive equivalence for circular references of arrays', () => {
    const source1: unknown[] = [];
    const source2 = [source1];
    const source3 = [source2];

    source1[0] = source1;

    expect(isEqual(source1, source2)).toBe(true);
    expect(isEqual(source2, source3)).toBe(true);
    expect(isEqual(source1, source3)).toBe(true);
  });

  // it('should compare objects with circular references', () => {
  //   let object1 = {};
  //   let object2 = {};

  //   object1.a = object1;
  //   object2.a = object2;

  //   expect(isEqual(object1, object2)).toBe(true);

  //   object1.b = 0;
  //   object2.b = Object(0);

  //   expect(isEqual(object1, object2)).toBe(true);

  //   object1.c = Object(1);
  //   object2.c = Object(2);

  //   expect(isEqual(object1, object2)).toBe(false);

  //   object1 = { a: 1, b: 2, c: 3 };
  //   object1.b = object1;
  //   object2 = { a: 1, b: { a: 1, b: 2, c: 3 }, c: 3 };

  //   expect(isEqual(object1, object2)).toBe(false);
  // });

  //   it('should have transitive equivalence for circular references of objects', () => {
  //     const object1 = {};
  //     const object2 = { a: object1 };
  //     const object3 = { a: object2 };

  //     object1.a = object1;

  //     expect(isEqual(object1, object2)).toBe(true);
  //     expect(isEqual(object2, object3)).toBe(true);
  //     expect(isEqual(object1, object3)).toBe(true);
  // });

  it('should compare objects with constructor properties', () => {
    expect(isEqual({ constructor: 1 }, { constructor: 1 })).toBe(true);
    expect(isEqual({ constructor: 1 }, { constructor: '1' })).toBe(false);
    expect(isEqual({ constructor: [1] }, { constructor: [1] })).toBe(true);
    expect(isEqual({ constructor: [1] }, { constructor: ['1'] })).toBe(false);
    expect(isEqual<PlainObject>({ constructor: Object }, {})).toBe(false);
  });

  it('should compare arrays', () => {
    expect(
      isEqual(
        [
          true,
          null,
          1,
          'a',
          undefined,
          [1, 2, 3],
          new Date(2012, 4, 23),
          /x/,
          { e: 1 },
        ],
        [
          true,
          null,
          1,
          'a',
          undefined,
          [1, 2, 3],
          new Date(2012, 4, 23),
          /x/,
          { e: 1 },
        ]
      )
    ).toBe(true);

    const array1 = [1];
    array1[2] = 3;

    const array2: unknown[] = [1];
    array2[1] = undefined;
    array2[2] = 3;

    expect(isEqual(array1, array2)).toBe(true);

    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false);
  });
});
