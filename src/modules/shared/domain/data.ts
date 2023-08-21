import { Fields } from '../../pdftk/record-fields'

/**
 * `F` is data formatted to fill form
 */
export interface DataDraw<F> {
    getFormattedData(): F
}

export interface DataAcrobat {
    getFields(): Fields
}

export interface DataForm {
    getFields(): Fields
}