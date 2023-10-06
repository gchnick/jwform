/* eslint-disable semi */
import fs from 'node:fs/promises';
import { fillPublisherRecordCard } from './app';
import { Gender, PublisherRecordCard } from './modules/store/publisher/publisher-record-card';

const publisher = () => {
    const data = new PublisherRecordCard({ serviceYear: ['2023'],
        data: { 
            name: 'Julio Publisher',
            birth: new Date(),
            gender: Gender.MALE,
        },
        records: [
            {
                1: { hours: '10', places: '25', remarks: 'Remark edited' } ,
            }
        ]
    })

    fillPublisherRecordCard(data, '/home/nick/store', true)
        .then(base64 => {
            fs.writeFile('/home/nick/store/publisherRecord.pdf', base64, 'base64')
        })
        .catch(err => console.error(`Error at save pdf generate ${err}\n`))
}

publisher()