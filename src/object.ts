import {
  isArray,
  isEmpty,
  isNil,
  isPlainObject,
  isString,
  isStringArray,
  isURLSearchParams,
} from '@busymango/is-esm';
import { deserialize, serialize } from '@ungap/structured-clone';

import { keyBy } from './array';
import type { ExcludeKey, OmitBy, PartialPick } from './types';

/**
 * Merges multiple partial objects into a new object of type T.
 * @param source Multiple partial objects to merge.
 * @returns A new object of type T.
 */
export function assign<T = unknown>(...source: Partial<T>[]): T {
  return Object.assign({}, ...source) as T;
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
  // Maybe environment don't supports the `structuredClone` function
  // And structuredClone clone `Porxy` will be error
  try {
    return structuredClone(source);
  } catch (error) {
    console.warn(
      "The current environment don't supports the `structuredClone` function"
    );
  }
  return deserialize(serialize(source, options)) as T;
}

/**
 * Creates a new object by omitting properties from the source object
 */
export function pick<T extends object, K extends keyof T>(
  source: T,
  keys: K[] | readonly K[]
): Pick<T, K> {
  const res: PartialPick<T, K> = {};
  for (const key of keys) {
    res[key] = source[key];
  }
  return res as Pick<T, K>;
}

/**
 * Creates a new object by omitting properties from the source object
 */
export function omit<T extends object, K extends keyof T>(
  source: T,
  keys: K[] | readonly K[]
): Omit<T, K> {
  const res = clone(source);
  for (const key of keys) {
    delete res[key];
  }
  return res;
}

interface AssertFunc<T extends object, S = never> {
  (val: unknown, key: keyof T): boolean;
  (val: unknown, key: ExcludeKey<T, S>): val is S;
}

/**
 * Creates a new object by omitting properties from the source object
 * that satisfy the given condition function.
 * @param source The source object to omit properties from.
 * @param match The match function to determine which properties to omit.
 * @returns A new object with omitted properties.
 */
export function iOmit<T extends object, S = never>(
  source: T,
  match: AssertFunc<T, S>
) {
  const res = clone(source);
  for (const _ in res) {
    const key = _ as keyof T;
    if (match(res[key], key)) {
      delete res[key];
    }
  }
  return res as OmitBy<T, S>;
}

/**
 * Constructs and returns a URLSearchParams object based on the provided initialization data.
 * Supports initializing with various types: URLSearchParams, string, string arrays, and plain objects.
 * Returns undefined if the initialization data does not match any supported type.
 *
 * @param init The initialization data for URLSearchParams.
 * @returns A URLSearchParams object constructed from the provided data, or undefined if invalid.
 */
export function iSearchParams(init: unknown) {
  if (isEmpty(init)) return;
  if (
    isString(init) ||
    isURLSearchParams(init) ||
    (isArray(init) && init.every(isStringArray))
  ) {
    return new URLSearchParams(init);
  }
  // Parses arrays of key-value pairs
  if (isStringArray(init)) {
    return new URLSearchParams(
      init
        .filter((e) => e.includes('='))
        .map((e) => e.trim())
        .join('&')
    );
  }
  if (isPlainObject(init)) {
    const source = Object.entries(iOmit(init, isNil));
    return new URLSearchParams(
      keyBy(
        source,
        ([key]) => key,
        ([, value]) => value?.toString?.() as string
      )
    );
  }
  return;
}
