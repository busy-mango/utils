import { describe, expect, it } from 'vitest';
import { assign, omit } from '../src/object';

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
    const condition = (val: unknown, key: string) => key === 'age';

    const result = omit(source, condition);
    expect(result).toEqual({ name: 'John', gender: 'male' });
  });

  it('should return the source object unchanged if no properties satisfy the condition', () => {
    const source = { name: 'John', age: 25, gender: 'male' };
    const condition = (val: unknown, key: string) => key === 'city';

    const result = omit(source, condition);
    expect(result).toEqual(source);
  });

  it('should return an empty object if the source object is empty', () => {
    const source = {};
    const condition = (val: unknown, key: string) => key === 'age';

    const result = omit(source, condition);
    expect(result).toEqual({});
  });
});