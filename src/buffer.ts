/** 
 * Converts an ArrayBuffer to a hexadecimal string representation. 
 * @param source The ArrayBuffer to convert. 
 * @returns The hexadecimal string representation of the input ArrayBuffer. 
 */
export function buffer2hex(source: ArrayBuffer) {
  const curs = Array.from(new Uint8Array(source));
  const hex = curs.map((byte) => byte.toString(16).padStart(2, '0'));
  return hex.join("");
}