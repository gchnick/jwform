import path from 'node:path'
import { Store } from '../store'
import { Data } from './data'
import { integrity } from './integrity'

export abstract class Form {
    #store: Store
    readonly #fileName: string
    readonly #md5: string
    protected isFlattened: boolean
    protected abstract mapper: Map<string, Point>

    constructor(store: Store,fileName: string, md5: string, isFlattened: boolean) {
        this.#store = store
        this.#fileName = fileName
        this.#md5 = md5
        this.isFlattened = isFlattened
        this.#isIntegrity()
    }

    #isIntegrity(): void {
        integrity(path.join(this.#store.path, this.#fileName), this.#md5)
    }

    protected get filePath() {
        return path.join(this.#store.path,`${this.#fileName}`)
    }

    abstract generatePDF(data: Data): Promise<string>
}

export type Point = {
    x: number
    y: number
}
