import { Hook, Extractions, ExtractionError } from './';
import { RequestService } from '../Request';
import { Response } from '../Response';
import { SessionService } from '../Session';
import { get } from 'object-path';

const extractHeader = (name: string, response: Response): string => {
    const value = response.headers.get(name);
    if (!value) {
        throw new ExtractionError(
            'headers',
            name,
            'header not found in response',
        );
    }

    return value;
};

const extractBody = async (
    path: string[],
    response: Response,
): Promise<unknown> => {
    const body = await response.json();
    const value = get(body, path);
    if (value === null || typeof value === 'undefined') {
        throw new ExtractionError(
            'body',
            path.join('.'),
            'value is null or undefined',
        );
    }

    return value;
};

const extract = async (path: string, response: Response): Promise<unknown> => {
    const [extraction, ...rest] = path.split('.') as [Extractions, string];
    if (extraction === 'headers') {
        return extractHeader(rest[0], response);
    }
    if (extraction === 'body') {
        return await extractBody(rest, response);
    }

    throw new ExtractionError(
        extraction,
        rest.join('.'),
        'Invalid extraction method',
    );
};

export const execute = async (hook: Hook) => {
    const response = await RequestService.send(hook.request);
    for (const [name, path] of Object.entries(hook.save)) {
        const value = await extract(path, response);
        SessionService.setForSession<typeof value>(name, value);
    }
};
