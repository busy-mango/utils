import { deserialize, serialize } from '@ungap/structured-clone';

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
  (val: unknown, key: ExcludeKey<T, S>): boolean;
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
  type OmitRes = OmitBy<T, S>;
  const res = clone<OmitRes>(source);
  for (const _ in res) {
    const key = _ as keyof OmitRes;
    if (match(res[key], key)) {
      delete res[key];
    }
  }
  return res;
}
