import fs from 'node:fs/promises'
import { PDFDocument, PDFFont, PDFPage, RGB, StandardFonts, rgb } from 'pdf-lib'
import { Form, Point } from '../../form/index'
import { Store } from '../store'
import { OtherTransactionsFormat, TransactionRecord } from './transaction-record'

export class TransactionForm extends Form {
    protected mapper: Map<string, Point>
    #document!: PDFDocument
    #textOptions!: {
        size: number,
        font: PDFFont,
        color: RGB, 
    }

    constructor(store: Store) {
        super(store, 'S-24-S.pdf', 'f8fc2a3345e648a07d80e3184ae79aea', true)
        this.mapper = new Map([
            ['date',{x: 85, y: 43}],
            ['donation',{x: 362, y: 43}],
            ['pay',{x: 178, y: 43}],
            ['cashAvance',{x: 178, y: 56}],
            ['cashDeposit',{x: 362, y: 56}],
            ['worldwideWorkDonations',{x: 45, y: 90}],
            ['congregationExpenses',{x: 45, y: 104}],
            ['otherTransactionsDescription',{x: 358, y: 119}],
            ['otherTransactionsAmount',{x: 45, y: 119}],
            ['total',{x: 45, y: 161}],
        ])
    }

    async #initTextOptions() {
        const helveticaFont = await this.#document.embedFont(StandardFonts.Helvetica)
        this.#textOptions = {
            size: 12,
            font: helveticaFont,
            color:  rgb(0,0,0), //rgb(28,27,31)
        }
    }

    generatePDF(transactionRecord: TransactionRecord): Promise<string>{
        const formatted = transactionRecord.getFormattedData()
        return new Promise((resolve, reject) => {
            fs.readFile(this.filePath)
                .then(data => PDFDocument.load(data))
                .then(srcPdf => srcPdf.copy())
                .then(async (pdf) => {
                    this.#document = pdf
                    await this.#initTextOptions()

                    Object.entries(formatted).forEach(([key, value]: [string, string | OtherTransactionsFormat | undefined]) => {
                        let point = this.mapper.get(key)
                        if(typeof value === 'string' && key === 'type') {
                            point = this.mapper.get(formatted.type)
                            point && this.#drawSvgPathDone(point)
                        }
                        
                        if(typeof value === 'string' && key === 'date') {
                            point && this.#drawText(value, point)
                        }

                        if(typeof value === 'string' && key !== 'type' && key !== 'date') {
                            point && this.#drawAccountingNumber(value, point)
                        }

                        if(typeof value !== 'string' && typeof value !== 'undefined') {
                            const descriptonPoint = this.mapper.get('otherTransactionsDescription')
                            const amountPoint = this.mapper.get('otherTransactionsAmount')
                            value.forEach((another, index) => {
                                const descriptonText = another.descripton
                                const amountText = another.amount

                                descriptonPoint && this.#drawTextWithTopPadding(index, descriptonText, descriptonPoint)
                                amountPoint && this.#drawAccountingNumberWithTopPadding(index, amountText, amountPoint)
                            })
                        }
                    })

                    const point = this.mapper.get('total')
                    const total = formatted.total
                    point && this.#drawAccountingNumber(total, point)

                    resolve(await pdf.saveAsBase64())
                }).catch(err => reject(err))
        })
    }

    #drawText(text: string, point: Point) {
        this.#getFirtPageAndMoveTo(point)
            .drawText(text, this.#textOptions)
    }

    #drawTextWithTopPadding(index: number, text:string, point: Point) {
        const withPadding = this.#addTopPadding(index, point)
        this.#drawText(text, withPadding)
    }

    #drawAccountingNumberWithTopPadding(index: number, amount: string, point: Point) {
        const withPadding = this.#addTopPadding(index, point)
        this.#drawAccountingNumber(amount, withPadding)
    }

    #drawSvgPathDone(point: Point) {
        const SVG_PATH_DONE = 'm9.55 18-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4Z'
        this.#getFirtPageAndMoveTo(point)
            .drawSvgPath(SVG_PATH_DONE, { color: rgb(0,0,0), scale: 0.8})
    }

    #drawAccountingNumber(amount: string, point: Point) {
        const PIXEL_WITH_CHAR = 5
        const margin = amount.length * PIXEL_WITH_CHAR
        const accountingPoint = {...point, x: point.x + margin }
        this.#drawText(amount, accountingPoint)
    }

    #addTopPadding(index: number, point: Point): Point {
        const TOP_PADDING = 14
        return {...point, y: point.y + TOP_PADDING * index }
    }

    #getFirtPageAndMoveTo(point: Point): PDFPage {
        const firtPage = this.#document.getPage(0)
        const width = firtPage.getWidth()
        const height = firtPage.getHeight()
        firtPage.moveTo(width - point.x, height - point.y)
        return firtPage
    }
}
