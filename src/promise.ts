export const sleep = (s: number) => new Promise((res) => setTimeout(res, s));

export const retry = <T>(func: () => Promise<T>, retries: number = 3) => {
  return new Promise<T>((resolve, reject) => {
    const itry = (count = 1) => {
      func()
        .then(resolve)
        .catch((error) => {
          if (count < retries) {
            itry(count + 1);
          } else {
            reject(error);
          }
        });
    };
    itry();
  });
};
