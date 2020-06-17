import fetch, {RequestInit} from 'node-fetch';
import {Request} from './Request';
import {Response} from '../Response';


export const send = async(request: Request): Promise<Response> => {
    const requestInit: RequestInit = {
        method: request.method,
        body: request.body,
        headers: request.headers,
    }

    const response = await fetch(request.url, requestInit);
    return {
        status: response.status,
        headers: response.headers,
        body: {
            text: () => response.text(),
            json: <T>() => <unknown>response.json() as T
        }
    }
}