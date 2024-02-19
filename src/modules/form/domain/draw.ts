import * as fs from "node:fs/promises";

import { DataDraw } from "@shared/domain/data";
import { Store } from "@shared/domain/store";
import {
  PDFDocument,
  PDFFont,
  PDFPage,
  RGB,
  rgb,
  StandardFonts,
} from "pdf-lib";

import { PRODUCER } from "./constans";
import { SetDrawTextOptionsFail } from "./errors";
import { File } from "./file";
import { Font, getFont } from "./fonts";

export type Point = {
  x: number;
  y: number;
};

type PaddingType = {
  type: Padding;
  value: number;
};

export enum Padding {
  TOP,
  LEFT,
}

export enum Aligned {
  CENTER,
  RIGHT,
}

export type Setting = {
  point: Point;
  font?: Font;
  padding?: [PaddingType, PaddingType?];
  aligned?: Aligned;
};

export type Mapper = Record<string, Setting>;

type DrawTextOption = {
  size: number;
  font: PDFFont;
  color: RGB;
};

/**
 * Represent a form that will be filled out by drawing the data. For this we will use `pdf-lib`
 * @argument {D} D data type with input of form
 * @argument {F} F data formatted to fill the form
 */
export abstract class Draw<D extends DataDraw<F>, F> extends File {
  protected document!: PDFDocument;
  protected readonly mapper: Mapper;
  protected readonly formatted: F;
  #options!: DrawTextOption;

  constructor(
    store: Store,
    fileName: string,
    data: D,
    md5: string,
    mapper: Mapper = {},
  ) {
    super(store, fileName, md5);
    this.formatted = data.getFormattedData();
    this.mapper = mapper;
  }

  protected createDocument(): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath)
        .then((data) => PDFDocument.load(data))
        .then((srcPdf) => srcPdf.copy())
        .then(async (pdf) => {
          this.document = pdf;
          this.document.setProducer(PRODUCER);
          resolve(await this.#initDrawTextOptions());
        })
        .catch((error) => reject(error));
    });
  }

  protected async createDocumentWithFont(font: Font): Promise<void> {
    const promise = this.createDocument();
    await this.#setDrawTextOptions(font);
    return promise;
  }

  protected async drawText(
    text: string,
    point: Point,
    font?: Font | undefined,
  ) {
    if (font) {
      await this.#setDrawTextOptions(font);
    }
    this.#getFirtPageAndMoveTo(point).drawText(text, this.#options);
  }

  protected async drawTextWithSetting(
    text: string,
    setting: Setting,
    index1 = 0,
    index2 = 0,
  ) {
    const point = this.#getPointWithLayout(
      setting,
      index1,
      index2,
      text.length,
    );
    await this.drawText(text, point, setting.font);
  }

  protected drawSvgPath(point: Point, svgPath: string) {
    this.#getFirtPageAndMoveTo(point).drawSvgPath(svgPath, {
      color: rgb(0, 0, 0),
      scale: 0.8,
    });
  }

  async #initDrawTextOptions() {
    const helveticaFont = await this.document.embedFont(
      StandardFonts.Helvetica,
    );
    this.#options = {
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    };
  }

  async #setDrawTextOptions(font: Font) {
    if (!this.document)
      throw SetDrawTextOptionsFail("The document is undefined");

    if (font.name !== undefined) {
      const buffer = await getFont(font.name);
      const newFont = await this.document.embedFont(buffer);
      this.#options = {
        ...this.#options,
        font: newFont,
      };
    }

    if (font.size !== undefined) {
      this.#options = {
        ...this.#options,
        size: font.size,
      };
    }
  }

  #getFirtPageAndMoveTo(point: Point): PDFPage {
    const firtPage = this.document.getPage(0);
    const width = firtPage.getWidth();
    const height = firtPage.getHeight();
    firtPage.moveTo(width - point.x, height - point.y);
    return firtPage;
  }

  #getPointWithLayout(
    setting: Setting,
    index1: number,
    index2: number,
    length = 0,
  ): Point {
    let point = { ...setting.point };

    if (setting.padding !== undefined) {
      point = this.#getPointWithPadding(setting, index1, index2);
    }

    if (setting.aligned !== undefined) {
      point = this.#getPointWithAligned(setting, length, point);
    }

    return point;
  }

  #getPointWithPadding(
    setting: Setting,
    index1: number,
    index2: number,
  ): Point {
    let point = { ...setting.point };

    if (setting.padding)
      for (const p of setting.padding) {
        if (p !== undefined && p.type === Padding.TOP) {
          const TOP = p.value * index1;
          point = { ...point, y: point.y + TOP };
        }

        if (p !== undefined && p.type === Padding.LEFT) {
          const LEFT = p.value * index2;
          point = { ...point, x: point.x - LEFT };
        }
      }

    return point;
  }

  #getPointWithAligned(setting: Setting, length: number, point: Point): Point {
    const PIXELS_WITH_CHAR = 5;
    let withAligned = { ...point };

    if (setting.aligned === Aligned.CENTER) {
      withAligned = {
        ...withAligned,
        x: withAligned.x + (length * PIXELS_WITH_CHAR) / 2,
      };
    }

    if (setting.aligned === Aligned.RIGHT) {
      withAligned = {
        ...withAligned,
        x: withAligned.x + length * PIXELS_WITH_CHAR,
      };
    }

    return withAligned;
  }

  abstract fillForm(): Promise<string>;
}
