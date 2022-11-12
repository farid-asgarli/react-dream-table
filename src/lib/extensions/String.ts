export class StringExtensions {
  static readonly Empty: string = "";
  static readonly WhiteSpace = " ";
  static IsNullOrEmpty = (val: any): boolean =>
    val === undefined || val === null || val.trim() === this.Empty;
}
