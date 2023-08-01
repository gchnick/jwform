import CryptoJS from 'crypto-js'
import fs from 'node:fs/promises'
import { NoIntegrityFormError } from './errors'

export const integrity = (filePath: string, md5: string) => {
    fs.readFile(filePath, { encoding: 'base64'})
        .then(base64 => {
            const MD5 = CryptoJS.MD5(base64).toString()
            if (!(MD5 === md5)) {
                throw new NoIntegrityFormError('Form invalid.')
            }
        })
        .catch(err => console.error('No read file: ', err))
}
