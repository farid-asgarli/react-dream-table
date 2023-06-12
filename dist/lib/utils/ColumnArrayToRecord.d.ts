/**
 * Converts given array to object.
 * @param arr Array to convert.
 * @param predicate Callback function to convert to object.
 * @returns Converted object.
 */
export declare function arrayToObject<ColumnDefinition extends {
    key: any;
}, ReturnObject>(arr: Array<ColumnDefinition>, predicate: (col: ColumnDefinition) => ReturnObject): Record<string, ReturnObject>;
