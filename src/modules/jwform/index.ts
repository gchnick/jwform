import type { ZodType } from "zod";
import type { Registry } from "../territory/schema";

import { InvalidArgumentError } from "../shared/domain/errors";
import { TerritoryRegistryForm } from "../territory/form";
import { territoryRegistrySchema } from "../territory/schema";
import { FolderStore } from "./folder-store";

export class JwForm {
  readonly #folder: FolderStore;
  readonly #bufferEncode: BufferEncoding;
  readonly #locale: Intl.LocalesArgument;

  constructor({
    path,
    bufferEncode = "base64",
    locale = "es-VE",
  }: {
    path: string;
    bufferEncode?: BufferEncoding;
    locale?: Intl.LocalesArgument;
  }) {
    this.#locale = locale;
    this.#folder = new FolderStore(path);
    this.#bufferEncode = bufferEncode;
  }

  async fillTerritoryRegistry({ data }: { data: string }) {
    const dataParsed = JSON.parse(data) as Registry;
    await this.#ensureThatDataIsValid(territoryRegistrySchema, dataParsed);

    const form = new TerritoryRegistryForm({
      folder: this.#folder,
      bufferEncode: this.#bufferEncode,
      data: dataParsed,
      locale: this.#locale,
    });

    return await form.fill();
  }

  async #ensureThatDataIsValid<T>(schema: ZodType<T>, data: unknown) {
    const result = await schema.safeParseAsync(data);
    if (!result.success) {
      throw new InvalidArgumentError(
        "Data of territories registry in invalid",
        { cause: result.error },
      );
    }
  }
}
