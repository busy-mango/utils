import { describe, expect, it } from 'vitest';

import { assign, clone, omit } from '../src/object';

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

describe('omit', () => {
  it('should create a new object by omitting properties that satisfy the condition', () => {
    const source = { name: 'John', age: 25, gender: 'male' };
    const condition = (_: unknown, key: string): _ is never => key === 'age';

    const result = omit(source, condition);
    expect(result).toEqual({ name: 'John', gender: 'male' });
  });

  it('should return the source object unchanged if no properties satisfy the condition', () => {
    const source = { name: 'John', age: 25, gender: 'male' };
    const condition = (_: unknown, key: string): _ is never => key === 'city';

    const result = omit(source, condition);
    expect(result).toEqual(source);
  });

  it('should return an empty object if the source object is empty', () => {
    const source = {};
    const condition = (_: unknown, key: string): _ is never => key === 'age';

    const result = omit(source, condition);
    expect(result).toEqual({});
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
});
