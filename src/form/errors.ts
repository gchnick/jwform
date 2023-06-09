export class NoIntegrityFormError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NoIntegrityFormError';
    }
}