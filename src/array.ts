import {
  isArray,
  isEmptyArray,
  isNil,
  isNotUndefined,
} from '@busymango/is-esm';

import { sizeOf } from './logic';
import { assign } from './object';
import type { ComparatorFunc, FalseValue, IKey } from './types';

/**
 * Removes falsy values (false, null, 0, "", undefined, and NaN) from an array.
 * @param source - The input array to compact.
 * @returns An array with falsy values removed.
 */
export function compact<T = unknown>(source: (T | FalseValue)[]): T[] {
  return source.filter(Boolean) as T[];
}

/**
 * Returns an array containing the provided source, ensuring it is an array.
 * If the source is already an array, returns it as-is. If the source is a single
 * element or undefined, wraps it in an array and returns.
 *
 * @param source The source array or single element to process.
 * @returns An array containing the source element(s).
 */
export function iArray<T = unknown>(...args: [T | T[]] | []) {
  const [source] = args;
  if (sizeOf(args) === 0) return [];
  return isArray(source) ? source : [source];
}

/**
 * Get the first item in an array or a default value
 */
export function theFirst<T = unknown>(source?: T[]): T | undefined {
  return source?.[0];
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
  comparator: ComparatorFunc<T> = Object.is
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
export function contains<T = unknown>(
  source: T[] = [],
  predicate: (value: T, index: number, source: T[]) => unknown
): boolean {
  return source.findIndex(predicate) >= 0;
}

/**
 * Finds the difference between two arrays based on a custom comparison function.
 * @param source The source array.
 * @param target The target array to compare against.
 * @param compare A custom comparison function that returns true if two elements are considered equal.
 *                Default is isEqual function.
 * @returns An array containing elements that are present in either source or target array but not in both.
 */
export const difference = <T>(
  source: T[],
  target: T[],
  comparator: (pre: T, cur: T) => boolean = Object.is
): T[] =>
  source
    .filter((e) => !contains(target, (v) => comparator(v, e)))
    .concat(target.filter((e) => !contains(source, (v) => comparator(v, e))));

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
export function sample<T = unknown>(source: T[] = [], size: number = 1): T[] {
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
  const max = Math.max(...source.map((e) => e.length));

  // Create an array of tuples, where the i-th tuple contains the i-th element from each of the input arrays.
  return Array.from({ length: max }).map((_, i) =>
    source.map((e) => e[i]).filter(isNotUndefined)
  );
}

/**
 * Converts the given array into an object indexed by a specified key.
 *
 * @param source The input array containing elements to be transformed.
 * @param theKey A function to generate object keys, taking the current element and returning a string key.
 * @param theValue (Optional) A function to generate object values, taking the current element and returning the corresponding value.
 *                If not provided, the current element is used as the value.
 *
 * @returns A new object where keys are derived from the array elements using theKey function,
 *          and values are either the array elements or values generated by theValue function.
 *
 * @example
 * ```typescript
 * const inputArray = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
 * const keyIndexedObject = keyBy(inputArray, (item) => item.id, (item) => item.name);
 * // Result of keyIndexedObject: { '1': 'Alice', '2': 'Bob' }
 * ```
 */
export function keyBy<const T, const K extends IKey, const V = T>(
  source: readonly T[],
  theKey: (current: T) => K,
  theValue?: (current: T) => V
): Record<K, V> {
  return source.reduce(
    (acc, cur) =>
      assign(acc, {
        [theKey(cur)]: theValue?.(cur) ?? (cur as unknown as V),
      } as Record<K, V>),
    {} as Record<K, V>
  );
}

/**
 * Sorts the given array based on the result of the provided serialization function.
 * @template T Type of array elements
 * @param source The array to be sorted
 * @param serialize The serialization function used to convert array elements into comparable numeric values
 */
export function sortBy<T>(
  source: T[],
  serialize: (item: T) => number | undefined
) {
  // Sorts the array using the provided serialization function
  source.sort(
    (pre, cur) => (serialize(pre) ?? Infinity) - (serialize(cur) ?? Infinity)
  );
}

/**
 * Sorts an array of items into groups. The return value is a map where the keys are
 * the group ids the given getGroupId function produced and the value is an array of
 * each item in that group.
 */
export const group = <T, Key extends IKey>(
  array: readonly T[],
  theKey: (item: T) => Key
): Partial<Record<Key, T[]>> => {
  return array.reduce(
    (acc, item) => {
      const key = theKey(item);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<Key, T[]>
  );
};

/**
 * Returns all items from the first list that do not exist in the second list.
 */
export const contrast = <T>(
  source: readonly T[],
  target: readonly T[],
  identity: (e: T) => IKey = (e: T) => e as IKey
): T[] => {
  if (isEmptyArray(source)) return [...target];
  if (isEmptyArray(target)) return [...source];
  const idList = target.reduce(
    (acc, e) => ({
      ...acc,
      [identity(e)]: true,
    }),
    {} as Record<IKey, boolean>
  );
  return source.filter((e) => !idList[identity(e)]);
};
