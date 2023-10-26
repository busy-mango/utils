import { isNonEmptyString } from '@busymango/is-esm';

/** 
 * Capitalizes the first letter of a string. 
 * @param string The string to capitalize. 
 * @returns The input string with the first letter capitalized. 
 */ 
export function capitalize<T extends string>(string: T): Capitalize<T> {
  const [first] = string;
  if (!isNonEmptyString(first)) return string as Capitalize<T>;
  return string.replace(first, first.toUpperCase()) as Capitalize<T>;
}

/** 
 * Encrypts a portion of the given string by replacing the characters within the specified range with a placeholder. 
 * @param string The string to encrypt. 
 * @param params An optional object containing parameters for encryption. 
 * @param params.start The starting index of the range to encrypt. Defaults to 0. 
 * @param params.end The ending index (exclusive) of the range to encrypt. Defaults to the length of the string. 
 * @param params.placeholder The placeholder string to use for encryption. Defaults to '*'. 
 * @returns The encrypted string with the specified range replaced by the placeholder. 
 */ 
export function encrypt(string: string, params: {
  end?: number;
  start?: number;
  placeholder?: string;
} = {}): string {
  const {
    start = 0,
    placeholder = '*',
    end = string.length,
  } = params;

  const length = end - start;
  if (length < 0) return string;

  const suffix = string.substring(end);
  const prefix = string.substring(0, start);
  return `${prefix}${placeholder.repeat(length)}${suffix}` 
}