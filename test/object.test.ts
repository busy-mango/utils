import { describe, expect, it } from 'vitest';

import { isNil, isNumber, isString } from '@busymango/is-esm';

import { assign, clone, iOmit, iSearchParams, omit, pick } from '../src/object';

describe('assign', () => {
  it('should merge multiple partial objects into a new object', () => {
    const obj1 = { name: 'John' };
    const obj2 = { age: 25 };
    const obj3 = { gender: 'male' };

    type T = typeof obj1 & typeof obj2 & typeof obj3;
    const result = assign<T>(obj1, obj2, obj3);
    expect(result).toEqual({ name: 'John', age: 25, gender: 'male' });
  });

  it('should return an empty object if no partial objects are provided', () => {
    const result = assign();
    expect(result).toEqual({});
  });
});

describe('pick', () => {
  it('should pick specified properties from the source object', () => {
    const source = { a: 1, b: 2, c: 3 };
    const result = pick(source, ['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('should return an empty object if no keys are specified', () => {
    const source = { a: 1, b: 2, c: 3 };
    const result = pick(source, []);
    expect(result).toEqual({});
  });

  it('should handle readonly array of keys', () => {
    const source = { a: 1, b: 2, c: 3 };
    const keys: readonly ('a' | 'c')[] = ['a', 'c'];
    const result = pick(source, keys);
    expect(result).toEqual({ a: 1, c: 3 });
  });
});

describe('omit', () => {
  it('should omit specified properties from the source object', () => {
    const source = { a: 1, b: 2, c: 3 };
    const result = omit(source, ['a', 'c']);
    expect(result).toEqual({ b: 2 });
  });

  it('should return the original object if no keys are specified', () => {
    const source = { a: 1, b: 2, c: 3 };
    const result = omit(source, []);
    expect(result).toEqual(source);
  });

  it('should handle readonly array of keys', () => {
    const source = { a: 1, b: 2, c: 3 };
    const keys: readonly ('a' | 'c')[] = ['a', 'c'];
    const result = omit(source, keys);
    expect(result).toEqual({ b: 2 });
  });
});

describe('iOmit', () => {
  it('should create a new object by omitting properties that satisfy the condition', () => {
    const source = { name: 'John', age: 25, gender: 'male' };
    expect(iOmit(source, isNumber)).toEqual({ name: 'John', gender: 'male' });
  });

  it('should return the source object unchanged if no properties satisfy the condition', () => {
    const source = { name: 'John', age: 25, gender: 'male' };
    const result = iOmit(source, isString);
    expect(result).toEqual({ age: 25 });
  });

  it('should return an empty object if the source object is empty', () => {
    const result = iOmit({ a: null as null | '1', c: '1' }, isNil);
    expect(new URLSearchParams(result).toString()).toEqual('c=1');
  });
});

describe('clone function', () => {
  type CircularModel = { foo: null | CircularModel };

  it('should perform deep cloning of an object', () => {
    const obj = { foo: { bar: 'baz' } };
    const clonedObj = clone(obj);
    expect(clonedObj).toEqual(obj); // Ensure the cloned object is equal to the original
    expect(clonedObj).not.toBe(obj); // Ensure the cloned object is not the same reference as the original
    expect(clonedObj.foo).toEqual(obj.foo); // Ensure nested objects are also cloned
    expect(clonedObj.foo).not.toBe(obj.foo); // Ensure nested objects are not the same reference as the original
  });

  it('should perform deep cloning of an array', () => {
    const arr = [{ foo: 'bar' }];
    const clonedArr = clone(arr);
    expect(clonedArr).toEqual(arr); // Ensure the cloned array is equal to the original
    expect(clonedArr).not.toBe(arr); // Ensure the cloned array is not the same reference as the original
    expect(clonedArr[0]).toEqual(arr[0]); // Ensure elements inside the array are also cloned
    expect(clonedArr[0]).not.toBe(arr[0]); // Ensure elements inside the array are not the same reference as the original
  });

  it('should return the same non-object value', () => {
    expect(clone(42)).toBe(42); // Ensure non-object values are returned as is
    expect(clone('foo')).toBe('foo');
    expect(clone(true)).toBe(true);
    // Add more test cases for other non-object values if needed
  });

  it('should handle options for deep cloning', () => {
    // Test deep cloning with lossy option
    const obj = { foo: { bar: 'baz' } };
    const clonedObjWithLossyOption = clone(obj, { lossy: true });
    expect(clonedObjWithLossyOption).toEqual(obj);
    expect(clonedObjWithLossyOption.foo).toEqual(obj.foo);
    expect(clonedObjWithLossyOption.foo).not.toBe(obj.foo);
    // Add more test cases for other options if applicable
  });

  it('should handle circular references', () => {
    const obj: CircularModel = { foo: null };
    obj.foo = obj;
    const clonedObj = clone(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
    expect(clonedObj.foo).toEqual(clonedObj);
  });

  it('should handle various types of objects', () => {
    // Test cloning of various types of objects, such as Date, RegExp, etc.
    const date = new Date();
    const clonedDate = clone(date);
    expect(clonedDate).toEqual(date);

    const regex = /foo/;
    const clonedRegex = clone(regex);
    expect(clonedRegex).toEqual(regex);
  });

  it('should polyfill when the environment not supports', () => {
    // @ts-ignore
    delete globalThis.structuredClone;

    // should handle circular references
    const obj: CircularModel = { foo: null };
    obj.foo = obj;
    const clonedObj = clone(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
    expect(clonedObj.foo).toEqual(clonedObj);
  });

  it('should clone proxy object to plain object', () => {
    const obj = { foo: { bar: 'baz' } };
    const proxy = new Proxy(obj, {
      get: () => ({ bar: 'baz' }),
      set: () => true,
    });

    const clonedObj = clone(proxy);
    expect(clonedObj).toEqual(obj); // Ensure the cloned object is equal to the original
    expect(clonedObj).not.toBe(obj); // Ensure the cloned object is not the same reference as the original
    expect(clonedObj.foo).toEqual(obj.foo); // Ensure nested objects are also cloned
    expect(clonedObj.foo).not.toBe(obj.foo); // Ensure nested objects are not the same reference as the original
  });
});

describe('iSearchParams function', () => {
  it('should return URLSearchParams if init is already a URLSearchParams object', () => {
    const params = new URLSearchParams('key1=value1&key2=value2');
    expect(iSearchParams(params)?.toString()).toBe(params?.toString());
  });

  it('should initialize from a single string', () => {
    const init = 'key1=value1&key2=value2';
    const result = iSearchParams(init);
    expect(result instanceof URLSearchParams).toBe(true);
    expect(result?.toString()).toBe(init);
  });

  it('should initialize from an array of string arrays', () => {
    const init = [
      ['key1', 'value1'],
      ['key2', 'value2'],
    ];
    const result = iSearchParams(init);
    expect(result instanceof URLSearchParams).toBe(true);
    expect(result?.toString()).toBe('key1=value1&key2=value2');
  });

  it('should initialize from a single string array', () => {
    const init = ['key1=value1', 'key2=value2', 'invalidEntry'];
    const result = iSearchParams(init);
    expect(result instanceof URLSearchParams).toBe(true);
    expect(result?.toString()).toBe('key1=value1&key2=value2');
  });

  it('should initialize from a plain object', () => {
    const init = {
      key1: 'value1',
      key2: 'value2',
      key3: null,
      key4: undefined,
    };
    const result = iSearchParams(init);
    expect(result instanceof URLSearchParams).toBe(true);
    expect(result?.toString()).toBe('key1=value1&key2=value2');
  });

  it('should return undefined for unsupported initialization data', () => {
    expect(iSearchParams(undefined)).toBe(undefined);
    expect(iSearchParams(null)).toBe(undefined);
    expect(iSearchParams(123)).toBe(undefined);
    expect(iSearchParams([])).toBe(undefined);
  });
});
