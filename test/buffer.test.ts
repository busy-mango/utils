import { describe, expect, it } from 'vitest';
import { buffer2hex } from '../src/buffer';

describe('buffer2hex', () => {
  it('should convert an empty ArrayBuffer to an empty string', () => {
    const source = new ArrayBuffer(0);
    expect(buffer2hex(source)).toBe('');
  });

  it('should convert an ArrayBuffer with single byte to its hexadecimal representation', () => {
    const source = new Uint8Array([255]).buffer;
    expect(buffer2hex(source)).toBe('ff');
  });

  it('should convert an ArrayBuffer with multiple bytes to its hexadecimal representation', () => {
    const source = new Uint8Array([10, 100, 200]).buffer;
    expect(buffer2hex(source)).toBe('0a64c8');
  });

  it('should convert an ArrayBuffer with leading zero bytes to its hexadecimal representation', () => {
    const source = new Uint8Array([0, 0, 255]).buffer;
    expect(buffer2hex(source)).toBe('0000ff');
  });
});
