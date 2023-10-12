export type Fields = Record<string, string>

const isFieldNameRegExp = /^FieldName:\s/
const isFieldValueRegExp = /^FieldValue:\s/
const isFieldFlagsRegExp = /^FieldFlags:\s/
const isCheckBoxRegExp = /^Check Box\d/
const isTextAttributeRegExp = (attribute: string) => new RegExp(String.raw`\/T\s\(${attribute}\)\n\/V\s\(.*\)`)
const isCheckBoxAttributeRegExp = (attribute: string) => new RegExp(String.raw`\/T\s\(${attribute}\)\n\/V\s/.*`)


export function asRecordFields(rawFields: string): Fields {
    const record: Fields = {}
    const fields = rawFields.split('---')
    fields.forEach(f => {
        let name = ''
        let value = ''
        const lines = f.split(/\r?\n/).filter(e => e)
        lines.forEach(l => {
            if(isFieldNameRegExp.test(l)) {
                name = String(l.substring(11))
            }

            if(isFieldFlagsRegExp.test(l)) {
                value = l.substring(12)
            }

            if(isFieldValueRegExp.test(l) && isCheckBoxRegExp.test(name)) {
                value = l.substring(11)
            }
        })
        record[name] = value
    }) 
    delete record['']
    return record
}

export function updateFdf(rawFdf: string, fields: Fields) {
    let update = String(rawFdf)
    for(const key in fields) {
        const value = fields[key]
        update = setAttribute(update, key, value)
    }
    return update
}

function setAttribute(raw: string, attribute: string, value: string) {
    const setter = String(raw)
    const isCheckBox = isCheckBoxRegExp.test(attribute)
    
    const regexp = isCheckBox ? isCheckBoxAttributeRegExp(attribute) : isTextAttributeRegExp(attribute)
    const replaceValue = isCheckBox ? `/T (${attribute})\n/V /${value}` : `/T (${attribute})\n/V (${value})`
    return setter.replace(regexp, replaceValue)
}