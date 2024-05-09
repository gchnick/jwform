import { FDF } from "@form/domain/fdf";
import { Form } from "@form/domain/form";
import { Pdf } from "@jwform/pdf";
import { Fields } from "@pdftk/record-fields";
import { fillForm, getFields } from "@pdftk/wrapper";

import { PublisherRecordCard } from "./publisher-record-card";

export class PublisherRecordCardForm
  extends FDF<PublisherRecordCard>
  implements Form
{
  static formName = "S-21-S.pdf";
  static md5 = "4e3c186030e33e86b1a489a14aed8799";
  readonly #pdf: Pdf;
  readonly locale?: Intl.LocalesArgument;

  constructor(pdf: Pdf, data: PublisherRecordCard, flatten = false) {
    super(data, flatten);
    this.#pdf = pdf;
  }

  async fill(): Promise<string> {
    const base64 = this.#pdf.value;
    return await fillForm(base64, this.fields, this.flatten);
  }

  async getFields(): Promise<Fields> {
    const base64 = this.#pdf.value;
    return await getFields(base64);
  }
}
