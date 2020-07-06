import { Request } from '../Request';

export type Extractions = 'body' | 'headers';

export type Save = {
    [name: string]: string;
};

export type Hook = {
    request: Request;
    save: Save;
};
