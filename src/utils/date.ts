export function getDateString(date: Date = new Date()) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
}

export function getNextDateString(orgDate: string, n = 1) {
  const date = new Date(orgDate);
  date.setDate(date.getDate() + n);
  return getDateString(date);
}
