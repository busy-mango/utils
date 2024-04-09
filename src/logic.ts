import {
  isArray,
  isDate,
  isNonEmptyArray,
  isObject,
  isRegExp,
} from '@busymango/is-esm';

/**
 * Checks if all elements in the source array satisfy the given predicate.
 * @param source The array to check.
 * @param predicate The function used to test each element.
 * @returns True if all elements satisfy the predicate, false otherwise.
 */
export function and<T = unknown>(source: T[], predicate: (val: T) => boolean) {
  return isNonEmptyArray(source) && source.every(predicate);
}

/**
 * Checks if any element in the source array satisfies the given predicate.
 * @param source The array to check.
 * @param predicate The function used to test each element.
 * @returns True if any element satisfies the predicate, false otherwise.
 */
export function or<T = unknown>(source: T[], predicate: (val: T) => boolean) {
  return source.some(predicate);
}

/**
 * Returns the source value if it is not equal to false, otherwise returns the placeholder value.
 * @param source The value to check.
 * @param placeholder The value to return if the source is false.
 * @returns The source value if it is not false, otherwise the placeholder value or undefined.
 */
export function ifnot<const T = unknown, D = undefined>(
  source: T | false,
  placeholder?: D
) {
  type R = T extends false ? D : Exclude<T, false>;
  return (source === false ? placeholder : source) as R;
}

/**
 *
 */
export const isEqual = <T>(source: T, target: T): boolean => {
  const records: Set<unknown>[] = [];

  const compare = <T>(source: T, target: T): boolean => {
    // Primitive compared
    if (Object.is(source, target)) return true;

    // Array compared
    if (isArray(source) && isArray(target)) {
      if (source.length !== target.length) return false;
      return source.every((cur, index) => compare(cur, target[index]));
    }

    if (isObject(target) && isObject(source)) {
      // If two references have already been compared, and you encounter a situation where they are compared again, you can determine that they are equal.
      if (records.some((set) => set.has(target) && set.has(source))) {
        return true;
      } else {
        records.push(new Set([target, source]));
      }

      // RegExp compared
      if (isRegExp(source) && isRegExp(target)) {
        return compare(source.toString(), target.toString());
      }

      // Date compared
      if (isDate(source) && isDate(target)) {
        return compare(source.getTime(), target.getTime());
      }

      const sourceKeys = Reflect.ownKeys(source) as (keyof T)[];
      const targetKeys = Reflect.ownKeys(target) as (keyof T)[];

      if (sourceKeys.length !== targetKeys.length) return false;
      if (sourceKeys.length === 0) return true;

      // Compare attributes one by one
      for (const iterator of sourceKeys) {
        if (!Reflect.has(target, iterator)) {
          return false;
        }
        if (!compare(source[iterator], target[iterator])) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  return compare(source, target);
};
