export function isSubArray<T>(arr: Array<T>, sub: Array<T>) {
  let x = arr.indexOf(sub[0]);
  let i = 0;
  while (i < sub.length) {
    if (i !== sub.indexOf(arr[x], i) || x >= arr.length) return false;
    x += 1;
    i += 1;
  }
  return true;
}
