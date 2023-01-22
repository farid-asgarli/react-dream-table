/**
 * Converts given array to object.
 * @param arr Array to convert.
 * @param predicate Callback function to convert to object.
 * @returns Converted object.
 */
export function arrayToObject<ColumnType extends { key: any }, ReturnObject>(
  arr: Array<ColumnType>,
  predicate: (col: ColumnType) => ReturnObject
) {
  const colObject: Record<string, ReturnObject> = {};

  arr.forEach((col) => {
    colObject[col.key] = predicate(col);
  });
  return colObject;
}
