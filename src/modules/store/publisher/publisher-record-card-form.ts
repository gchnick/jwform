import { Acrobat } from '../../form/domain/acrobat'
import { Fields } from '../../pdftk/record-fields'
import { fillForm, getFields } from '../../pdftk/wrapper'
import { Store } from '../store'
import { PublisherRecordCard } from './publisher-record-card'

export class PublisherRecordCardForm extends Acrobat<PublisherRecordCard> {
    
    constructor(store: Store, data: PublisherRecordCard, flatten = false, fileName = 'S-21-S.pdf') {
        super(
            store,
            fileName,
            data,
            '4e3c186030e33e86b1a489a14aed8799',
            flatten
        )
    }

    fillForm(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.getFormAsBase64()
                .then( async (base64) => {
                    resolve(await fillForm(base64, this.fields, this.flatten))
                })
                .catch(err => reject(err))
        })
    }

    getFields(): Promise<Fields> {
        return new Promise((resolve, reject) => {
            this.getFormAsBase64()
                .then( async (base64) => {
                    resolve(await getFields(base64))
                })
                .catch(err => reject(err))
        })
    }
}