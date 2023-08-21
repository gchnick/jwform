import fs from 'fs/promises'
import { Fields } from '../../pdftk/record-fields'
import { DataAcrobat } from '../../shared/domain/data'
import { Store } from '../../store/store'
import { File } from './file'

export abstract class Acrobat<D extends DataAcrobat> extends File {
    protected readonly flatten: boolean
    protected readonly fields: Fields

    constructor(store: Store, fileName: string, data: D, md5: string, flatten: boolean) {
        super(store, fileName, md5)
        this.flatten = flatten
        this.fields = data.getFields()
    }

    protected getFormAsBase64() {
        return fs.readFile(this.filePath, {encoding: 'base64'})
    }

    abstract fillForm(): Promise<string>

    abstract getFields(): Promise<Fields>
}