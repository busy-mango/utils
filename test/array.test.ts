import { describe, expect, it } from 'vitest';
import{ isArray, isValidKey, isString } from '@busymango/is-esm';
import { compact, theLast, dedup, includes, shuffle, sample } from '../src/array';

describe('compact should remove falsey values from the array', () => {
  it('', () => {
    expect(
      compact([1, 2, false, 3, '', 0]),
    ).toStrictEqual(
      [1, 2, 3],
    );
  });

  it('', () => {
    expect(
      compact(['apple', '', 'banana', false, '']),
    ).toStrictEqual(
      ['apple', 'banana'],
    );

    expect(
      compact([null, undefined, false]),
    ).toStrictEqual([]);
  })
});

describe('theLast should return the last element of the array', () => {
  it('', () => {
    expect(theLast([1, 2, 3])).toStrictEqual(3);

    expect(theLast(
      ['apple', 'banana', 'orange']
    )).toStrictEqual('orange');
  
    expect(theLast([])).toStrictEqual(undefined);
  
    expect(theLast()).toStrictEqual(undefined);
  });
});

describe('dedup should remove duplicate elements from the array', () => {
  it('', () => {
    expect(dedup([])).toStrictEqual([]);

    expect(dedup([1, 2, 3, 2, 4, 1])).toStrictEqual([1, 2, 3, 4]);
  
    expect(dedup(
      ['apple', 'banana', 'apple', 'orange']
    )).toStrictEqual(
      ['apple', 'banana', 'orange'],
    );
    
    expect(dedup(
      [[1, 2], [1, 2], { id: '3' }, { id: '3', name: 3 }],
      (pre, cur) => {
        if (isArray(pre) && isArray(cur)) {
          return pre.length === cur.length && pre.every((v, i) => cur[i] === v);
        }
        if (isValidKey('id',pre, isString) && isValidKey('id',cur, isString) ) {
          return cur.id === pre.id;
        }
  
        return pre === cur;
      }
    )).toStrictEqual(
      [[1, 2], { id: '3' }],
    );
  });
});

describe('includes should check if the array includes an element that satisfies the predicate', () => {
  it('', () => {
    expect(includes(
      [1, 2, 3, 4],
      (value) => value > 2),
    ).toBeTruthy();
  
    expect(includes(
      [1, 2, 3],
      (_, index) => index === 2),
    ).toBeTruthy();
  
    expect(includes(
      ['apple', 'banana', 'orange'],
      (value) => value === 'grape'),
    ).toBeFalsy();
    expect(includes([], (value) => value === 1)).toBeFalsy();
  });
});

describe('shuffle', () => {
  it('should shuffle the elements of the array', () => {
    const source = [1, 2, 3, 4, 5];
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
    const source = [1, 2, 3, 4, 5];
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
