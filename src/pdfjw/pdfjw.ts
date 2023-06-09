import { Data, Form } from "../form";
import { Store } from "../store";


export class Pdfjw {
    private store: Store;

    constructor(storePath: string) {
        this.store = Store.getInstance();
        this.store.path = storePath;
    }

    public generate(from: Form, data: Data, flatten: boolean): any {
        // TODO: Implementar metodo
        return false;
    }

}