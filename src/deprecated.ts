/**
 * Checks if an array includes an element that satisfies a given condition.
 * @deprecated plz use `contains` instead
 * @param source - The input array.
 * @param predicate - A function that tests whether an element satisfies the condition.
 * @returns True if the array includes an element that satisfies the condition, otherwise false.
 */
export function includes<T = unknown>(
  source: T[] = [],
  predicate: (value: T, index: number, source: T[]) => unknown
): boolean {
  return source.findIndex(predicate) >= 0;
}
