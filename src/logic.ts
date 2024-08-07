import {
  isArray,
  isDate,
  isFunction,
  isNonEmptyArray,
  isObject,
  isPlainObject,
  isRegExp,
  isString,
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
  source: T,
  placeholder?: D
) {
  type V = Exclude<T, false>;
  type R = T extends false ? (V extends never ? D : V | D) : V;
  return (source === false ? placeholder : source) as R;
}

/**
 * Returns the size or length of the provided source object based on its type.
 * Supports arrays, strings, Maps, Sets, and plain objects.
 * For arrays and strings, returns the length.
 * For Maps and Sets, returns the size.
 * For plain objects, returns the number of own enumerable properties.
 * If the source is of an unsupported type or undefined, returns 0.
 *
 * @param source The object whose size or length needs to be determined.
 * @returns The size or length of the source object, or 0 if unsupported or undefined.
 */
export const sizeOf = (source: unknown) => {
  if (isArray(source)) return source.length;
  if (isString(source)) return source.length;
  if (source instanceof Map) return source.size;
  if (source instanceof Set) return source.size;
  if (isPlainObject(source)) return Object.keys(source).length;
  return 0;
};

/**
 * Compares two values for equality.
 * @param source The first value.
 * @param target The second value.
 * @returns True if the two values are equal, otherwise false.
 */
export const isEqual = <T>(source: T, target: T): boolean => {
  // Record references to objects that have already been compared, preventing infinite recursion due to circular references.
  const records: Set<unknown>[] = [];

  const preventing = (pre: unknown, cur: unknown) => {
    // If two references have already been compared, and you encounter a situation where they are compared again, you can determine that they are equal.
    if (records.some((set) => set.has(pre) && set.has(cur))) {
      return true;
    } else {
      records.push(new Set([pre, cur]));
    }
    return false;
  };

  const compare = <T>(source: T, target: T): boolean => {
    // Function compared
    if (isFunction(source) && isFunction(target)) {
      if (preventing(source, target)) return true;
      else return Object.is(source, target);
    }

    // Primitive compared
    if (Object.is(source, target)) return true;

    // Array compared
    if (isArray(source) && isArray(target)) {
      if (preventing(source, target)) return true;
      if (source.length !== target.length) return false;
      return source.every((cur, index) => compare(cur, target[index]));
    }

    if (isObject(target) && isObject(source)) {
      if (preventing(source, target)) return true;

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
