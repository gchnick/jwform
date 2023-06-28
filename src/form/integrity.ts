import fs from 'fs'
import { NoIntegrityFormError } from './errors'

const md5sum = require('md5')

export const integrity = (filePath: string, md5: string): void => {
    fs.readFile(filePath, (_err: any, buf: any) => {
        const _md5sum = md5sum(buf)

        if (!((_md5sum as string) === md5)) {
            throw new NoIntegrityFormError('Form invalid.')
        }
    })
}
