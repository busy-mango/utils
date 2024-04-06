/**
 * Wraps a callback function with error handling, returning undefined if an error occurs.
 * @param this The context to bind to the callback function.
 * @param callback The callback function to be executed.
 * @returns A new function that wraps the callback function with error handling.
 */
export function safe<A extends unknown[], R>(
  this: unknown,
  callback: (...args: A) => R
) {
  return (...args: A) => {
    try {
      return callback.call(this, ...args);
    } catch {
      return undefined;
    }
  };
}

/**
 * Provides safe parsing functions for different data formats.
 */
export const parse = {
  /**
   * Parses a JSON string into the specified type, with error handling.
   * @param args The arguments to be passed to the JSON.parse function.
   * @returns The parsed data of the specified type, or undefined if an error occurs.
   */
  json: <T>(...args: Parameters<typeof JSON.parse>) => {
    return safe<typeof args, T>(JSON.parse)(...args) as T;
  },
};
