import { StringExtensions } from "../extensions/String";

export const concatStyles = (...args: (string | boolean | undefined)[]) =>
  args
    .filter((x) => x !== "undefined" && x !== undefined && x !== false)
    .join(StringExtensions.WhiteSpace);
