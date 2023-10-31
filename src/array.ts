import { isNil } from "@busymango/is-esm";

import type { ComparatorFunc, FalseValue } from "./types";

/**
 * Removes falsey values from the given array and returns a new array. 
 * @param source The array to compact.
 * @returns A new array with falsey values removed.
 */ 
export function compact<T = unknown>(source: (T | FalseValue)[]): T[] {
  return source.filter(Boolean) as T[];
}

/** 
 * Returns the last element of the given array, or undefined if the array is empty. 
 * @param source The array to retrieve the last element from. 
 * @returns The last element of the array, or undefined if the array is empty. 
 */ 
export function theLast<T = unknown>(source?: T[]): T | undefined {
  const { length } = source ?? [];
  return source?.[length - 1] ?? undefined;
}

/** 
 * Removes duplicate elements from the given array based on the provided comparator function. 
 * @param source The array to remove duplicates from. 
 * @param comparator The function used to compare elements for duplication. 
 * @returns A new array with duplicate elements removed. 
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
 * Checks if the given array includes an element that satisfies the provided predicate function. 
 * @param source The array to search for the element. 
 * @param predicate The function used to test each element. 
 * @returns True if the array includes an element that satisfies the predicate, false otherwise. 
 */ 
export function includes<T = unknown>(
  source: T[] = [],
  predicate: (value: T, index: number, source: T[]) => unknown,
): boolean {
  return source.findIndex(predicate) >= 0;
}

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * @param source The array to shuffle.
 * @returns The shuffled array.
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
 * Returns a random sample of elements from the given array.
 * @param source The array to sample from.
 * @param size The number of elements to include in the sample. Defaults to 1.
 * @returns An array containing the sampled elements.
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
