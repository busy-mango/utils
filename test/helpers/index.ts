export const sleep = (time?: number) =>
  new Promise<null>((resolve) => setTimeout(() => resolve(null), time));
