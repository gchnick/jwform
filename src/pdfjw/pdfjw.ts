import { Data } from "../form/data";
import { Form } from "../form/form";
import { Store } from "../form/store";


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