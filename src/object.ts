import { OmitBy, ExcludeKey } from './types';

import { isArray } from '@busymango/is-esm';

/**
 * Merges multiple partial objects into a new object of type T.
 * @param source Multiple partial objects to merge.
 * @returns A new object of type T.
 */
export function assign<T = unknown>(...source: Partial<T>[]): T {
  return Object.assign({}, ...source) as T;
}

interface AssertFunc<T extends object, S = never>{
  (val: unknown, key: ExcludeKey<T, S>): boolean,
  (val: unknown, key: ExcludeKey<T, S>): val is S,
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
  condition: AssertFunc<T, S>,
) {
  type Res = OmitBy<T, S>;
  const res = assign<Res>(source);

  for (const key in res) {
    const _key = key as keyof Res;
    if (condition(res[_key], _key)) delete res[_key];
  }

  return res as Res;
}

export function clone<T = unknown>(source: T): T {
  if (isArray(source)) return source.map(clone) as T;
  return source;
}
