import { PDFFont, RGB } from "pdf-lib";

import { Font } from "./fonts";

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

export type DrawTextOption = {
  size: number;
  font: PDFFont;
  color: RGB;
};
