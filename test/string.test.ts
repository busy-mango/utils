import { describe, expect, it } from 'vitest';

import { capitalize, encrypt } from '../src/string';

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('world')).toBe('World');
    expect(capitalize('')).toBe('');
    expect(capitalize('123abc')).toBe('123abc');
  });
});

describe('encrypt', () => {
  it('should encrypt a portion of the string', () => {
    expect(
      encrypt('hello world', { start: 6, end: 11, placeholder: '*' })
    ).toBe('hello *****');
    expect(encrypt('hello world', { start: 0, end: 5, placeholder: '#' })).toBe(
      '##### world'
    );
    expect(encrypt('hello world', { start: 6, placeholder: '*' })).toBe(
      'hello *****'
    );
    expect(encrypt('hello world', { end: 5, placeholder: '#' })).toBe(
      '##### world'
    );
    expect(encrypt('hello world', { start: 6, end: 11 })).toBe('hello *****');
    expect(encrypt('hello world', { start: 11, end: 6 })).toBe('hello world');
    expect(encrypt('hello world', { start: 0, end: 0 })).toBe('hello world');
    expect(encrypt('31248122933', { start: 3, end: 7 })).toBe('312****2933');
  });
});
