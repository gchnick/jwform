import { StringValueObject } from "./value-object/string-value-object";

export class FileName extends StringValueObject {
  static fromValue(value: string) {
    return new FileName(value);
  }
}
