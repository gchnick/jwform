import { InvalidArgumentError } from "../shared/domain/errors";
import { schema } from "../territory/schema";
import { TerritoryRegistryData } from "../territory/territory-registry-data";
import { TerritoryRegistryForm } from "../territory/territory-registry-form";
import { Pdf } from "./pdf";

export class JwForm {
  readonly locale?: Intl.LocalesArgument;
  readonly pdf: Pdf;

  constructor({
    locale,
    bufferEncode,
    path,
  }: {
    locale?: Intl.LocalesArgument;
    bufferEncode?: string;
    path?: string;
  }) {
    this.locale = locale;
    this.pdf = new Pdf({ bufferEncode, path });
  }

  async fillTerritoryRegistry(data: TerritoryRegistryData) {
    const result = await schema.safeParseAsync(data);
    if (!result.success) {
      throw new InvalidArgumentError(
        "Data of territories registry in invalid",
        { cause: result.error },
      );
    }

    const form = new TerritoryRegistryForm({
      pdf: this.pdf,
      data,
      locale: this.locale,
    });
    return await form.fill();
  }
}
