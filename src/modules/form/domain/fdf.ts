import * as fs from "node:fs/promises";

import { Fields } from "@pdftk/record-fields";
import { DataFDF } from "@shared/domain/data";
import { Store } from "@shared/domain/store";

import { File } from "./file";

/**
 * Represent a form that will be filled out by the data. For this we will use `Pdftk`.
 * `FDF (Forms Data Format)`
 */
export abstract class FDF<D extends DataFDF> extends File {
  protected readonly flatten: boolean;
  protected readonly fields: Fields;

  constructor(
    store: Store,
    fileName: string,
    data: D,
    md5: string,
    flatten: boolean,
  ) {
    super(store, fileName, md5);
    this.flatten = flatten;
    this.fields = data.getFields();
  }

  protected getFormAsBase64() {
    return fs.readFile(this.filePath, { encoding: "base64" });
  }

  abstract fillForm(): Promise<string>;

  abstract getFields(): Promise<Fields>;
}
