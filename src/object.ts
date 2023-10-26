import { OmitBy, ExcludeKey } from './types';

/**
 * Merges multiple partial objects into a new object of type T.
 * @param source Multiple partial objects to merge.
 * @returns A new object of type T.
 */
export function assign<T = unknown>(...source: Partial<T>[]): T {
  return Object.assign({}, ...source) as T;
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
  condition: (val: unknown, key: ExcludeKey<T, S>) => boolean,
) {
  type Res = OmitBy<T, S>;
  const res = assign<Res>(source);

  for (const key in res) {
    const _val = res[key];
    const _key = key as ExcludeKey<T, S>;
    if (condition(_val, _key)) delete res[key];
  }

  return res as Res;
}
