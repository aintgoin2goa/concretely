import { CustomError } from 'ts-custom-error';
import { Extractions } from './';

export default class ExtractionError extends CustomError {
    private extraction: Extractions;
    private path: string;

    constructor(extraction: Extractions, path: string, message: string) {
        const fullMessage = `Could not extract ${path} from ${extraction}: ${message}`;
        super(fullMessage);
        this.extraction = extraction;
        this.path = path;
    }
}
