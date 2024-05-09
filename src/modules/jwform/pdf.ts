import { existsSync, readFileSync } from "node:fs";

import * as CryptoJS from "crypto-js";

import { FileNotFound, NoIntegrityForm } from "../form/domain/errors";
import { InvalidArgumentError } from "../shared/domain/errors";

const isBase64Valid =
  /^(?:[\d+/A-Za-z]{4})*(?:[\d+/A-Za-z]{4}|[\d+/A-Za-z]{3}=|[\d+/A-Za-z]{2}={2})$/;

export class Pdf {
  readonly value!: string;

  constructor({
    bufferEncode,
    path,
  }: {
    bufferEncode?: string;
    path?: string;
  }) {
    if (!bufferEncode && !path) {
      this.#throwInvalidArgumentError();
    }

    if (bufferEncode && isBase64Valid.test(bufferEncode)) {
      this.value = bufferEncode;
    }

    if (!bufferEncode && path) {
      this.#ensurePdfFileExists(path);
      this.value = readFileSync(path, { encoding: "base64" });
    }
  }

  #ensurePdfFileExists(value: string) {
    if (!existsSync(value)) {
      throw FileNotFound(`The file form -> <${value}> is not fount`);
    }
  }

  #throwInvalidArgumentError() {
    throw new InvalidArgumentError("Constructor with arguments invalid");
  }

  ensureIsIntegrity(md5: string, formName: string) {
    const MD5 = CryptoJS.MD5(this.value).toString();
    if (MD5 !== md5) {
      throw NoIntegrityForm(`The form <${formName}> is invalid`);
    }
  }
}
