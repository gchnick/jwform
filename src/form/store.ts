export class Store {
    private static instance: Store;
    private _path: string = "";

    private constructor() { }

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }

        return Store.instance;
    }

    set path(path: string) {
        this._path = path;
    }

    get path() {
        return this._path;
    }
}