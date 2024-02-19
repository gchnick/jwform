import { Fields } from "@pdftk/record-fields";

/**
 * `F` is data formatted to fill form
 */
export interface DataDraw<F> {
  getFormattedData(): F;
}

export interface DataFDF {
  getFields(): Fields;
}

export interface DataForm {
  getFields(): Fields;
}
