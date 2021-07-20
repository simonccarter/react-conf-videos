export default (func: (...idx: unknown[]) => void, delay = 300) => {
  let prev = 0;

  return (...args: unknown[]) => {
    const now = new Date().getTime();

    if (now - prev > delay) {
      prev = now;

      return func(...args);
    }
  };
};
