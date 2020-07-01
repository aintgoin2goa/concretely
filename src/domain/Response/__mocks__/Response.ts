import { Response } from '../Response';
import { Response as FetchResponse, ResponseInit } from 'node-fetch';

export type SyntheticResponseInput = {
    body?: string;
    status?: number;
    headers?: { [key: string]: string };
};

const syntheticResponse = (input: SyntheticResponseInput): Response => {
    const responseInit: ResponseInit = {
        status: input.status,
        headers: input.headers,
    };
    const fetchResponse = new FetchResponse(input.body, responseInit);
    return new Response(fetchResponse);
};

export { syntheticResponse };
