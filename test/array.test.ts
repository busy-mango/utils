import { describe, expect, it } from 'vitest';

import { isArray, isString, isValidKey } from '@busymango/is-esm';

import {
  compact,
  contrast,
  dedup,
  difference,
  group,
  includes,
  keyBy,
  sample,
  shuffle,
  sortBy,
  theFirst,
  theLast,
  zip,
} from '../src/array';

describe('compact should remove falsey values from the array', () => {
  it('', () => {
    expect(compact([1, 2, 0, null, 3, undefined, false])).toStrictEqual([
      1, 2, 3,
    ]);
  });

  it('', () => {
    expect(compact(['apple', '', 'banana', false, ''])).toStrictEqual([
      'apple',
      'banana',
    ]);

    expect(compact([null, undefined, false])).toStrictEqual([]);
  });
});

describe('theLast should return the last element of the array', () => {
  it('', () => {
    expect(theLast([1, 2, 3])).toStrictEqual(3);

    expect(theLast(['apple', 'banana', 'orange'])).toStrictEqual('orange');

    expect(theLast([])).toStrictEqual(undefined);

    expect(theLast()).toStrictEqual(undefined);
  });
});

describe('dedup should remove duplicate elements from the array', () => {
  it('', () => {
    expect(dedup([])).toStrictEqual([]);

    expect(dedup([1, 2, 3, 2, 4, 1])).toStrictEqual([1, 2, 3, 4]);

    expect(dedup(['apple', 'banana', 'apple', 'orange'])).toStrictEqual([
      'apple',
      'banana',
      'orange',
    ]);

    expect(
      dedup([[1, 2], [1, 2], { id: '3' }, { id: '3', name: 3 }], (pre, cur) => {
        if (isArray(pre) && isArray(cur)) {
          return pre.length === cur.length && pre.every((v, i) => cur[i] === v);
        }
        if (
          isValidKey('id', pre, isString) &&
          isValidKey('id', cur, isString)
        ) {
          return cur.id === pre.id;
        }

        return pre === cur;
      })
    ).toStrictEqual([[1, 2], { id: '3' }]);
  });
});

describe('includes should check if the array includes an element that satisfies the predicate', () => {
  it('', () => {
    expect(includes([1, 2, 3, 4], (value) => value > 2)).toBeTruthy();

    expect(includes([1, 2, 3], (_, index) => index === 2)).toBeTruthy();

    expect(
      includes(['apple', 'banana', 'orange'], (value) => value === 'grape')
    ).toBeFalsy();
    expect(includes([], (value) => value === 1)).toBeFalsy();
  });
});

describe('shuffle', () => {
  it('should shuffle the elements of the array', () => {
    const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const res = shuffle(source);
    expect(res).not.toStrictEqual(source);
    expect(res).toHaveLength(source.length);
    expect(new Set(res)).toStrictEqual(new Set(source));
  });

  it('should return an empty array when the input array is empty', () => {
    const source: number[] = [];
    const res = shuffle(source);
    expect(res).toEqual(source);
  });
});

describe('shuffle', () => {
  it('should shuffle the elements of the array', () => {
    const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const res = shuffle(source);
    expect(res).not.toStrictEqual(source);
    expect(res).toHaveLength(source.length);
    expect(new Set(res)).toStrictEqual(new Set(source));
  });

  it('should return an empty array when the input array is empty', () => {
    const source: number[] = [];
    const res = shuffle(source);
    expect(res).toEqual(source);
  });
});

describe('sample', () => {
  it('should return a random sample of elements from the array', () => {
    const size = 3;
    const source = [1, 2, 3, 4, 5];
    const res = sample(source, size);

    expect(res).toHaveLength(size);
    expect(source).toContain(res[0]);
    expect(source).toContain(res[1]);
    expect(source).toContain(res[2]);
  });

  it('should return an empty array when the input array is empty', () => {
    const source: number[] = [];
    expect(sample(source)).toEqual(source);
  });

  it('should return an empty array when the size is less than 1', () => {
    const source = [1, 2, 3, 4, 5];
    expect(sample(source, -1)).toEqual([]);
  });
});

describe('zip', () => {
  it('should zip arrays correctly', () => {
    const zipped = zip<string | number | boolean>(
      [1, 2, 3],
      ['a', 'b', 'c'],
      [true, false, true]
    );

    expect(zipped).toEqual([
      [1, 'a', true],
      [2, 'b', false],
      [3, 'c', true],
    ]);
  });

  it('should handle arrays of different lengths', () => {
    const zipped = zip<string | number | boolean>(
      [1, 2, 3],
      ['a', 'b'],
      [true, false, true, false]
    );

    const expected = [[1, 'a', true], [2, 'b', false], [3, true], [false]];

    expect(zipped).toStrictEqual(expected);
  });
});

describe('keyBy', () => {
  it('keyBy should correctly index the array elements by the specified key', () => {
    const inputArray = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    const result = keyBy(
      inputArray,
      (item) => item.id.toString(),
      (item) => item.name
    );

    expect(result['1']).toStrictEqual('Alice');
    expect(result['2']).toStrictEqual('Bob');
  });

  it('keyBy should use the default value if theValue function is not provided', () => {
    const inputArray = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    const result = keyBy(inputArray, (item) => item.id.toString());

    expect(result['1']).toStrictEqual({ id: 1, name: 'Alice' });
    expect(result['2']).toStrictEqual({ id: 2, name: 'Bob' });
  });
});

describe('sortBy', () => {
  // Sample array to be sorted
  const source = [
    { name: 'Unknown1' },
    { name: 'John', age: 30 },
    { name: 'Unknown2' },
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 35 },
  ];

  it('sortBy should sort source', () => {
    // Serialization function: returns age property of each object
    const serialize = ({ age }: { age?: number }) => age;

    // Call the function to be tested
    sortBy(source, serialize);

    // Assert that the array is sorted correctly
    expect(source).toStrictEqual([
      { name: 'Alice', age: 25 },
      { name: 'John', age: 30 },
      { name: 'Bob', age: 35 },
      { name: 'Unknown1' },
      { name: 'Unknown2' },
    ]);
  });
});

describe('group function', () => {
  it('groups by provided attribute', () => {
    const source = [
      { key: 'a', word: 'hello' },
      { key: 'b', word: 'hey' },
      { key: 'b', word: 'bye' },
      { key: 'a', word: 'oh' },
      { key: 'c', word: 'ok' },
    ];

    const res = group(source, ({ key }) => key);

    expect(res.a?.length).toEqual(2);
    expect(res.b?.length).toEqual(2);
    expect(res.c?.length).toEqual(1);
    expect(res.c?.[0].word).toEqual('ok');
  });
});

describe('theFirst function', () => {
  it('returns first item in list', () => {
    expect(
      theFirst([
        { game: 'a', score: 100 },
        { game: 'b', score: 200 },
      ])
    ).toStrictEqual({ game: 'a', score: 100 });
  });
});

describe('contrast function', () => {
  it('handles empty source', () => {
    const result = contrast([], ['a']);
    expect(result).toStrictEqual(['a']);
  });
  it('handles empty target', () => {
    const result = contrast(['a'], []);
    expect(result).toStrictEqual(['a']);
  });
  it('returns all items from root that dont exist in other', () => {
    const result = contrast(['a', 'b', 'c'], ['c', 'd', 'e']);
    expect(result).toStrictEqual(['a', 'b']);
  });
  it('uses identity function', () => {
    const code = (word: string) => ({ word });
    const decode = ({ word }: { word: string }) => word;

    const result = contrast(
      [code('a'), code('b'), code('c')],
      [code('c'), code('d'), code('e')],
      decode
    );
    expect(result).toStrictEqual([code('a'), code('b')]);
  });
});

describe('difference', () => {
  it('should return the difference between two arrays with default comparator', () => {
    const source = [1, 2, 3, 4];
    const target = [3, 4, 5, 6];
    const result = difference(source, target);
    expect(result).toEqual([1, 2, 5, 6]);
  });

  it('should return the difference between two arrays with custom comparator', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const target = [{ id: 3 }, { id: 4 }, { id: 5 }];
    const comparator = (a: { id: number }, b: { id: number }) => a.id === b.id;
    const result = difference(source, target, comparator);
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 4 }, { id: 5 }]);
  });

  it('should return an empty array if both arrays are empty', () => {
    const source: unknown[] = [];
    const target: unknown[] = [];
    const result = difference(source, target);
    expect(result).toEqual([]);
  });

  it('should return the source array if the target array is empty', () => {
    const source = [1, 2, 3];
    const target: unknown[] = [];
    const result = difference(source, target);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should return the target array if the source array is empty', () => {
    const source: unknown[] = [];
    const target = [4, 5, 6];
    const result = difference(source, target);
    expect(result).toEqual([4, 5, 6]);
  });

  it('should handle arrays with primitive types correctly', () => {
    const source = ['a', 'b', 'c'];
    const target = ['b', 'c', 'd'];
    const result = difference(source, target);
    expect(result).toEqual(['a', 'd']);
  });

  it('should handle arrays with complex objects correctly using a custom comparator', () => {
    const source = [{ name: 'Alice' }, { name: 'Bob' }];
    const target = [{ name: 'Bob' }, { name: 'Charlie' }];
    const comparator = (a: { name: string }, b: { name: string }) =>
      a.name === b.name;
    const result = difference(source, target, comparator);
    expect(result).toEqual([{ name: 'Alice' }, { name: 'Charlie' }]);
  });
});
