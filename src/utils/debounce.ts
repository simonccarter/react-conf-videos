export default (func: (...idx: unknown[]) => void, delay = 300) => {
  let timer: NodeJS.Timeout;

  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};
