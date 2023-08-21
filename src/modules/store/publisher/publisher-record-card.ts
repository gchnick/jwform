import { Fields } from '../../pdftk/record-fields'
import { DataAcrobat } from '../../shared/domain/data'

type MonthRecord = {
    places?: string,
    videos?: string,
    hours: string,
    returnVisits?: string,
    studies?: string,
    remarks?: string
}

enum CheckBoxOptions {
    ON = 'Yes',
    OFF = 'Off'
}

export enum Hope {
    EARTHLY,
    HEAVENLY
}

export enum Gender {
    MALE,
    FEMALE
}

const Months = {
    September: 1,
    October: 2,
    November: 3,
    December: 4,
    January: 5,
    February: 6,
    March: 7,
    April: 8,
    May: 9,
    June: 10,
    July: 11,
    August: 12
} as const

export enum Month {
    SEP = 1,
    OCT = 2,
    NOV = 3,
    DEC = 4,
    JAN = 5,
    FEB = 6,
    MAR = 7,
    APR = 8,
    MAY = 9,
    JUN = 10,
    JUL = 11,
    AUG = 12
}

export enum Privilege {
    ELDER,
    SERVANT,
    PIONEER
}

type PublisherData = {
    name: string,
    birth: Date,
    gender: Gender,
    inmerced?: Date,
    hope?: Hope,
    privileges?: [(Privilege.ELDER | Privilege.SERVANT)?, Privilege.PIONEER?]
}

export type AnualRecord = Partial<Record<Month, MonthRecord>>

type Records = [AnualRecord, AnualRecord?]

type ServiceYear = [string, string?]

export class PublisherRecordCard implements DataAcrobat {
    serviceYear?: ServiceYear
    data?: PublisherData
    records?: Records

    constructor({serviceYear, data, records}: {serviceYear?: ServiceYear, data?: PublisherData, records?: Records}) {
        this.serviceYear = serviceYear
        this.data = data
        this.records = records
    }

    getFields(): Fields {
        const fields: Fields = {}

        this.#addServiceYears(fields)
        this.#addData(fields)
        this.#addAnualRecords(fields)

        return fields
    }

    #addServiceYears(fields: Fields) {
        if(this.serviceYear && this.serviceYear[0]) {
            fields['Service Year'] = this.serviceYear[0]
        }

        if(this.serviceYear && this.serviceYear[1]) {
            fields['Service Year_2'] = this.serviceYear[1]
        }
    }

    #addData(fields: Fields) {
        if(this.data) {
            fields['Name'] = this.data.name
            fields['Date of birth'] = this.data.birth.toLocaleDateString('es-VE')
            if(this.data.inmerced) {
                fields['Date immersed'] = this.data.inmerced.toLocaleDateString('es-VE')
            }

            if(this.data.gender === Gender.MALE) {
                fields['Check Box1'] = CheckBoxOptions.ON
                fields['Check Box2'] = CheckBoxOptions.OFF
            }

            if(this.data.gender === Gender.FEMALE) {
                fields['Check Box2'] = CheckBoxOptions.ON
                fields['Check Box1'] = CheckBoxOptions.OFF
            }

            if(this.data.hope === Hope.EARTHLY) {
                fields['Check Box3'] = CheckBoxOptions.ON
                fields['Check Box4'] = CheckBoxOptions.OFF
            }

            if(this.data.hope === Hope.HEAVENLY) {
                fields['Check Box4'] = CheckBoxOptions.ON
                fields['Check Box3'] = CheckBoxOptions.OFF
            }

            if(this.data.privileges && this.data.privileges[0] === Privilege.ELDER) {
                fields['Check Box5'] = CheckBoxOptions.ON
                fields['Check Box6'] = CheckBoxOptions.OFF
            }

            if(this.data.privileges && this.data.privileges[0] === Privilege.SERVANT) {
                fields['Check Box6'] = CheckBoxOptions.ON
                fields['Check Box5'] = CheckBoxOptions.OFF
            }

            if(this.data.privileges && this.data.privileges[1] === Privilege.PIONEER) {
                fields['Check Box7'] = CheckBoxOptions.ON
            }
        }
    }

    #addAnualRecords(fields: Fields) {
        if(this.records) {
            this.records.forEach((a, i) => {
                a && this.#addAnualRecord(i + 1, fields, a)
            })
        }
    }

    #addAnualRecord(index: number, fields: Fields, record: AnualRecord) {
        for(const month of Object.values(Months)) {
            const thisRecord = record[month]
            thisRecord && this.#addMounthRecord(index, fields, thisRecord, month)
        }
    }

    #addMounthRecord(index: number, fields: Fields, record: MonthRecord, month: number) {
        record.places && this.#addRecordField(index, fields, 'Place', month, record.places)
        record.videos && this.#addRecordField(index, fields, 'Video', month, record.videos)
        record.hours && this.#addRecordField(index, fields, 'Hours', month, record.hours)
        record.returnVisits && this.#addRecordField(index, fields, 'RV', month, record.returnVisits)
        record.studies && this.#addRecordField(index, fields, 'Studies', month, record.studies)
        record.remarks && this.#addRecordRemarkField(index, fields, 'Remarks', month, record.remarks)
    }

    #addRecordField(index: number, fields: Fields, type: string, month: number, value: string){
        fields[`${index}-${type}_${month}`] = value
    }

    #addRecordRemarkField(index: number, fields: Fields, type: string, month: number, value: string){
        const monthString = Object.keys(Months)[month-1]
        const key = index === 1 ? `${type}${monthString}` : `${type}${monthString}_2`
        fields[key] = value
    }
}