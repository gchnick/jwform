import { integrity } from "./integrity";
import { Store } from "./store";

export abstract class Form {
    private store: Store;
    private fileName: string;
    private md5: string;
    protected isFlattened: boolean;

    constructor(fileName: string, md5: string, isFlattened: boolean) {
        this.fileName = fileName;
        this.store = Store.getInstance();
        this.md5 = md5;
        this.isFlattened = isFlattened;
    }

    isIntegrity(): void {
        integrity(`${this.store.path}/${this.fileName}`, this.md5);
    }
}