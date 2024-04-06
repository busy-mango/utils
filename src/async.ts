/**
 * Async wait
 */
export const sleep = (s: number) => new Promise((res) => setTimeout(res, s));
