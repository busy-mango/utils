import { isNil, isNotUndefined } from "@busymango/is-esm";

import type { ComparatorFunc, FalseValue } from "./types";

/**
 * Removes falsy values (false, null, 0, "", undefined, and NaN) from an array.
 * @param source - The input array to compact.
 * @returns An array with falsy values removed.
 */
export function compact<T = unknown>(source: (T | FalseValue)[]): T[] {
  return source.filter(Boolean) as T[];
}

/**
 * Returns the last element of an array or undefined if the array is empty.
 * @param source - The input array.
 * @returns The last element of the array or undefined if the array is empty.
 */ 
export function theLast<T = unknown>(source?: T[]): T | undefined {
  const { length } = source ?? [];
  return source?.[length - 1] ?? undefined;
}

/**
 * Removes duplicate elements from an array based on a comparator function.
 * @param source - The input array.
 * @param comparator - A function used to compare elements for equality.
 * @returns An array with duplicate elements removed.
 */
export function dedup<T = unknown>(
  source: T[] = [],
  comparator: ComparatorFunc<T> = (pre, cur) => pre === cur,
) {
  const res: T[] = [];
  for (const iterator of source) {
    const dup = res.find((item) => comparator(item, iterator));
    if (isNil(dup)) res.push(iterator);
  }
  return res;
}

/**
 * Checks if an array includes an element that satisfies a given condition.
 * @param source - The input array.
 * @param predicate - A function that tests whether an element satisfies the condition.
 * @returns True if the array includes an element that satisfies the condition, otherwise false.
 */
export function includes<T = unknown>(
  source: T[] = [],
  predicate: (value: T, index: number, source: T[]) => unknown,
): boolean {
  return source.findIndex(predicate) >= 0;
}

/**
 * Shuffles the elements of an array.
 * @param source - The input array to shuffle.
 * @returns A new array with the elements randomly rearranged.
 */
export function shuffle<T = unknown>(source: T[] = []): T[] {
  // Create a copy of the source array to avoid modifying the original array
  const res = [...source];
  // Loop through the array in reverse order
  for (let i = res.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));
    // Swap the elements at indices i and j
    [res[i], res[j]] = [res[j], res[i]];
  }
  // Return the shuffled array
  return res;
}

/**
 * Returns a random sample of elements from an array.
 * @param source - The input array.
 * @param size - The number of elements to sample.
 * @returns A new array with randomly selected elements.
 */
export function sample<T = unknown>(
  source: T[] = [],
  size: number = 1,
): T[] {
  // If size is less than 1, return an empty array
  if (!(size >= 1)) return [];
  // Shuffle the source array & Return a portion of the shuffled array with the specified size
  return shuffle(source).slice(0, size); 
}

/**
 * Combines multiple arrays into an array of tuples, where each tuple contains the i-th element from each input array.
 * @param source - Arrays to zip together.
 * @returns An array of tuples.
 */
export function zip<T = unknown>(...source: T[][]) {
  // Find the maximum length of the input arrays.
  const max = Math.max(...source.map((e => e.length)));
  
  // Create an array of tuples, where the i-th tuple contains the i-th element from each of the input arrays.
  return Array.from({ length: max }).map(
    (_, i) => source.map(e => e[i]).filter(isNotUndefined),
  );
}
