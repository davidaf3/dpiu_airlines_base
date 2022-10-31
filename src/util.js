export function sortAlphabetically(key) {
  return (e1, e2) => {
    const k1 = key(e1);
    const k2 = key(e2);
    if (k1 === k2) return 0;
    return k1 > k2 ? 1 : -1;
  };
}
