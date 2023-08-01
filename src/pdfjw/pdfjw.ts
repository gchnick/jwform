import { Data } from '../form/data'
import { Form } from '../form/form'

export class PdfJW {

    generate (form: Form, data: Data): Promise<string> {
        return form.generatePDF(data)
    }
}
