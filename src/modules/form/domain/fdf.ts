import { Fields } from "@pdftk/record-fields";
import { DataFDF } from "@shared/domain/data";

/**
 * Represent a form that will be filled out by the data. For this we will use `Pdftk`.
 * `FDF (Forms Data Format)`
 */
export abstract class FDF<D extends DataFDF> {
  protected readonly flatten: boolean;
  protected readonly fields: Fields;

  constructor(data: D, flatten: boolean) {
    this.flatten = flatten;
    this.fields = data.getFields();
  }

  abstract fill(): Promise<string>;

  abstract getFields(): Promise<Fields>;
}
