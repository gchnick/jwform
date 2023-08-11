import CryptoJS from 'crypto-js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { PDFDocument, PDFFont, PDFPage, RGB, StandardFonts, rgb } from 'pdf-lib'
import { Data } from '../../shared/domain/data'
import { Store } from '../../store/store'
import { NoIntegrityForm } from './no-integrity-form'

type Point = {
    x: number,
    y: number
}

type Font = {
    size: number,
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

type TextOptions = {
    size: number,
    font: PDFFont,
    color: RGB, 
}

/**
 * `D` is the data type with input of form
 * `F` is data formatted to fill the form
 */
export abstract class Form<D extends Data<F>, F> {
    #store: Store
    readonly #fileName: string
    readonly #md5: string
    protected isFlattened: boolean
    protected mapper: Mapper
    protected document!: PDFDocument
    protected textOptions!: TextOptions
    protected formatted: F

    constructor(store: Store,fileName: string, data: D, mapper: Mapper, md5: string, isFlattened: boolean) {
        this.#store = store
        this.#fileName = fileName
        this.mapper = mapper
        this.#md5 = md5
        this.isFlattened = isFlattened
        this.formatted = data.getFormattedData()
        this.#isIntegrity()
    }

    #isIntegrity(): void {
        const filePath = path.join(this.#store.path, this.#fileName)
        fs.readFile(filePath, { encoding: 'base64'})
            .then(base64 => {
                const MD5 = CryptoJS.MD5(base64).toString()
                if (MD5 !== this.#md5) {
                    throw NoIntegrityForm('Form invalid.')
                }
            })
            .catch(err => console.error('No read file: ', err))
    }

    protected get filePath() {
        return path.join(this.#store.path,`${this.#fileName}`)
    }

    abstract fillForm(): Promise<string>

    protected createDocument(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.filePath)
                .then(data => PDFDocument.load(data))
                .then(srcPdf => srcPdf.copy())
                .then(async (pdf) => {
                    this.document = pdf
                    resolve(await this.#initTextOptions())
                })
                .catch(err => reject(err))
        })
    }

    async #initTextOptions() {
        const helveticaFont = await this.document.embedFont(StandardFonts.Helvetica)
        this.textOptions = {
            size: 12,
            font: helveticaFont,
            color:  rgb(0,0,0),
        }
    }

    protected drawText(text: string, point: Point, font: Font | undefined = undefined) {
        this.#getFirtPageAndMoveTo(point)
            .drawText(text, font ? {...this.textOptions, ...font} : this.textOptions)
    }

    protected drawTextWithSetting(text: string, setting: Setting, index1 = 0, index2 = 0) {
        const point = this.#getPointWithLayout(setting, index1, index2, text.length)
        this.drawText(text, point, setting.font)
    }


    protected drawSvgPath(point: Point, svgPath: string) {
        this.#getFirtPageAndMoveTo(point)
            .drawSvgPath(svgPath, { color: rgb(0,0,0), scale: 0.8})
    }

    #getFirtPageAndMoveTo(point: Point): PDFPage {
        const firtPage = this.document.getPage(0)
        const width = firtPage.getWidth()
        const height = firtPage.getHeight()
        firtPage.moveTo(width - point.x, height - point.y)
        return firtPage
    }

    #getPointWithLayout(setting: Setting, index1: number, index2: number, length = 0): Point {
        let point = {...setting.point}

        
        
        if(typeof setting.padding !== 'undefined') {
            point = this.#getPointWithPadding(setting, index1, index2)
        }

        if(typeof setting.aligned !== 'undefined') {
            point = this.#getPointWithAligned(setting, length, point)
        }

        return point
    }

    #getPointWithPadding(setting: Setting, index1: number, index2: number): Point {
        let point = {...setting.point}

        setting.padding?.forEach(p => {
            if(p !== undefined && p.type === Padding.TOP) {
                const TOP = p.value * index1
                point = { ...point, y: point.y + TOP }
            }

            if(p !== undefined && p.type === Padding.LEFT) {
                const LEFT = p.value * index2
                point = { ...point, x: point.x - LEFT }
            }
        })

        return point
    }

    #getPointWithAligned(setting: Setting, length: number, point: Point): Point {
        const PIXELS_WITH_CHAR = 5
        let withAligned = {...point}

        if(setting.aligned === Aligned.CENTER) {
            withAligned = { ...withAligned, x: withAligned.x + (length * PIXELS_WITH_CHAR)/2 }
        }

        if(setting.aligned === Aligned.RIGHT) {
            withAligned = { ...withAligned, x: withAligned.x + length * PIXELS_WITH_CHAR }
        }

        return withAligned
    }
}
