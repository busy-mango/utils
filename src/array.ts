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
