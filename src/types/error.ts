export class GeneralError {

    private details: string;
    private internalCode: string;

    constructor(internalCode: string, details: string) {
        this.details = details;
        this.internalCode = internalCode;
    }
}