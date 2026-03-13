export const randomGenerator = (length: number = 6): string => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

export const timeFrom = (minutes: number = 5): Date =>
  new Date(Date.now() + minutes * 60 * 1000);
