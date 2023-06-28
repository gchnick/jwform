export class Data {
    private readonly _fields: Map<any, string>

    constructor (data: Object) {
        this._fields = new Map(Object.entries(data))
    }

    get fields (): Map<any, string> {
        return this._fields
    }
}
