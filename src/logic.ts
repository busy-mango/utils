import { isNonEmptyArray } from '@busymango/is-esm';

/**
 * Checks if all elements in the source array satisfy the given predicate.
 * @param source The array to check.
 * @param predicate The function used to test each element.
 * @returns True if all elements satisfy the predicate, false otherwise.
 */
export function and<T = unknown>(
  source: T[],
  predicate: (val: T) => boolean,
) {
  return isNonEmptyArray(source) && source.every(predicate);
}

/**
 * Checks if any element in the source array satisfies the given predicate.
 * @param source The array to check.
 * @param predicate The function used to test each element.
 * @returns True if any element satisfies the predicate, false otherwise.
 */
export function or<T = unknown>(
  source: T[],
  predicate: (val: T) => boolean,
) {
  return source.some(predicate);
}

/**
 * Returns the source value if it is not equal to false, otherwise returns the placeholder value.
 * @param source The value to check.
 * @param placeholder The value to return if the source is false.
 * @returns The source value if it is not false, otherwise the placeholder value or undefined.
 */
export function ifnot<T = unknown, D = never>(
  source: T | boolean,
  placeholder?: D,
) {
  return source !== false ? source : placeholder ?? undefined;
}
