import { describe, expect, it } from 'vitest';

import { Scope } from '../src/scope';

describe('SystemScope', () => {
  const scope = new Scope<string>();
  
  it('should convert source string into an array', () => {
    const source = 'abc:def:ghi';
    const expected = ['abc', 'def', 'ghi'];
    expect(scope.convert(source)).toStrictEqual(expected);
  });

  it('should check if define and current match', () => {
    const define = 'abc:def:*';
    const current = 'abc:def:ghi';
    expect(scope.isMatch(define, current)).toBeTruthy();
  });

  it('should check if define and current do not match', () => {
    const define = 'abc:def:*';
    const current = 'abc:xyz:ghi';
    expect(scope.isMatch(define, current)).toBeFalsy();
  });

  it('should check if current is contained in defines', () => {
    const current = 'abc:def:ghi';
    const defines = ['abc:def:*', 'xyz:*:ghi'];

    expect(scope.isContain(defines, current)).toBeTruthy();
  });

  it('should check if current is not contained in defines', () => {
    const current = 'abc:xyz:ghi';
    const defines = ['abc:def:*', 'xyz:*:ghi'];
    expect(scope.isContain(defines, current)).toBeFalsy();
  });
});