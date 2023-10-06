import CryptoJS from 'crypto-js'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { Store } from '../../store/store'
import { FileNotFound, NoIntegrityForm } from './errors'

/**
 * File of form with integrity validation
 */
export abstract class File {
    readonly #store: Store
    readonly #fileName: string
    readonly #md5: string

    /**
     * 
     * @param store path of form store
     * @param fileName name of file form
     * @param md5 to validate integrity
     */
    constructor(store: Store, fileName: string, md5: string) {
        this.#store = store
        this.#fileName = fileName
        this.#md5 = md5
        this.#isIntegrity()
    }

    protected get filePath() {
        const filePath = path.join(this.#store.path,`${this.#fileName}`)
        if(!existsSync(filePath)) throw FileNotFound(`The file form -> '${this.#fileName}' is not fount`)
        return filePath
    }

    #isIntegrity() {
        fs.readFile(this.filePath, { encoding: 'base64'})
            .then(base64 => {
                const MD5 = CryptoJS.MD5(base64).toString()
                if (MD5 !== this.#md5) {
                    throw NoIntegrityForm(`The form '${this.#fileName}' is invalid`)
                }
            })
            .catch(err => console.error(`Failed to try read file '${this.#fileName}'. Because -> ${err}`))
    }
}