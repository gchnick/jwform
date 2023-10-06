import fs from 'node:fs/promises';
import { PDFDocument, PDFFont, PDFPage, RGB, StandardFonts, rgb } from 'pdf-lib';
import { DataDraw } from '../../shared/domain/data';
import { Store } from '../../store/store';
import { PRODUCER } from './constans';
import { SetDrawTextOptionsFail } from './errors';
import { File } from './file';
import { Font, getFont } from './fonts';

type Point = {
    x: number,
    y: number
}

type PaddingType = {
    type: Padding,
    value: number,
}

export enum Padding {
    TOP,
    LEFT,
}

export enum Aligned {
    CENTER,
    RIGHT,
}

type Setting = {
    point: Point,
    font?: Font,
    padding?: [PaddingType, PaddingType?],
    aligned?: Aligned,
}

export type Mapper = Record<string, Setting>

type DrawTextOption = {
    size: number,
    font: PDFFont,
    color: RGB, 
}

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

    constructor(store: Store,fileName: string, data: D, mapper: Mapper, md5: string) {
        super(store, fileName, md5);
        this.mapper = mapper;
        this.formatted = data.getFormattedData();
    }

    protected createDocument(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.filePath)
                .then(data => PDFDocument.load(data))
                .then(srcPdf => srcPdf.copy())
                .then(async (pdf) => {
                    this.document = pdf;
                    this.document.setProducer(PRODUCER);
                    resolve(await this.#initDrawTextOptions());
                })
                .catch(err => reject(err));
        });
    }

    protected createDocumentWithFont(font: Font): Promise<void> {
        const promise = this.createDocument();
        this.#setDrawTextOptions(font);
        return promise;
    }

    protected drawText(text: string, point: Point, font: Font | undefined = undefined) {
        font && this.#setDrawTextOptions(font);
        this.#getFirtPageAndMoveTo(point)
            .drawText(text, this.#options);
    }

    protected drawTextWithSetting(text: string, setting: Setting, index1 = 0, index2 = 0) {
        const point = this.#getPointWithLayout(setting, index1, index2, text.length);
        this.drawText(text, point, setting.font);
    }


    protected drawSvgPath(point: Point, svgPath: string) {
        this.#getFirtPageAndMoveTo(point)
            .drawSvgPath(svgPath, { color: rgb(0,0,0), scale: 0.8});
    }

    async #initDrawTextOptions() {
        const helveticaFont = await this.document.embedFont(StandardFonts.Helvetica);
        this.#options = {
            size: 12,
            font: helveticaFont,
            color:  rgb(0,0,0),
        };
    }

    async #setDrawTextOptions(font: Font) {
        if(!this.document) throw SetDrawTextOptionsFail('The document is undefined');
        
        if(typeof font.name !== 'undefined') {
            const buffer = await getFont(font.name);
            const newFont = await this.document.embedFont(buffer);
            this.#options = {
                ...this.#options,
                font: newFont
            };
        }

        if(typeof font.size !== 'undefined') {
            this.#options = {
                ...this.#options,
                size: font.size
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

    #getPointWithLayout(setting: Setting, index1: number, index2: number, length = 0): Point {
        let point = {...setting.point};

        
        
        if(typeof setting.padding !== 'undefined') {
            point = this.#getPointWithPadding(setting, index1, index2);
        }

        if(typeof setting.aligned !== 'undefined') {
            point = this.#getPointWithAligned(setting, length, point);
        }

        return point;
    }

    #getPointWithPadding(setting: Setting, index1: number, index2: number): Point {
        let point = {...setting.point};

        setting.padding?.forEach(p => {
            if(p !== undefined && p.type === Padding.TOP) {
                const TOP = p.value * index1;
                point = { ...point, y: point.y + TOP };
            }

            if(p !== undefined && p.type === Padding.LEFT) {
                const LEFT = p.value * index2;
                point = { ...point, x: point.x - LEFT };
            }
        });

        return point;
    }

    #getPointWithAligned(setting: Setting, length: number, point: Point): Point {
        const PIXELS_WITH_CHAR = 5;
        let withAligned = {...point};

        if(setting.aligned === Aligned.CENTER) {
            withAligned = { ...withAligned, x: withAligned.x + (length * PIXELS_WITH_CHAR)/2 };
        }

        if(setting.aligned === Aligned.RIGHT) {
            withAligned = { ...withAligned, x: withAligned.x + length * PIXELS_WITH_CHAR };
        }

        return withAligned;
    }

    abstract fillForm(): Promise<string>
}
