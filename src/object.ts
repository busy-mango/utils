import { isFunction } from '@busymango/is-esm';
import { deserialize, serialize } from '@ungap/structured-clone';

import type { ExcludeKey, OmitBy } from './types';

/**
 * Merges multiple partial objects into a new object of type T.
 * @param source Multiple partial objects to merge.
 * @returns A new object of type T.
 */
export function assign<T = unknown>(...source: Partial<T>[]): T {
  return Object.assign({}, ...source) as T;
}

interface AssertFunc<T extends object, S = never> {
  (val: unknown, key: ExcludeKey<T, S>): boolean;
  (val: unknown, key: ExcludeKey<T, S>): val is S;
}

/**
 * Creates a new object by omitting properties from the source object
 * that satisfy the given condition function.
 * @param source The source object to omit properties from.
 * @param condition The condition function to determine which properties to omit.
 * @returns A new object with omitted properties.
 */
export function omit<T extends object, S = never>(
  source: T,
  condition: AssertFunc<T, S>
) {
  type Res = OmitBy<T, S>;
  const res = assign<Res>(source);

  for (const key in res) {
    const _key = key as keyof Res;
    if (condition(res[_key], _key)) delete res[_key];
  }

  return res;
}

/**
 * Copies the given object or value deeply.
 * If the browser supports the `structuredClone` function, it uses it to perform deep cloning.
 * Otherwise, it uses the `polyfillStructuredClone` function to perform deep cloning.
 * @param source The source object or value to be copied.
 * @param options Optional parameters to configure the deep cloning options.
 * @returns The deep-cloned object or value.
 */
export function clone<const T = unknown>(
  source: T,
  // About `transfer`: https://github.com/ungap/structured-clone
  options?: StructuredSerializeOptions & { json?: boolean; lossy?: boolean }
): T {
  // Check if the current environment supports the `structuredClone` function
  return typeof structuredClone !== 'undefined' && isFunction(structuredClone)
    ? structuredClone(source)
    : (deserialize(serialize(source, options)) as T);
}
