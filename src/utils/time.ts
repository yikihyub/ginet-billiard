export const getKSTDate = (date: Date = new Date()) => {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000);
};
export const formatKST = (date: Date) => {
  return getKSTDate(date).toISOString().replace('T', ' ').substring(0, 19);
};
