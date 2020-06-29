import {
    Headers as FetchHeaders,
    Response as FetchResponse,
    ResponseInit,
} from 'node-fetch';

export class Headers {
    private headers: FetchHeaders;
    constructor(headers: FetchHeaders) {
        this.headers = headers;
    }

    get(name: string) {
        return this.headers.get(name);
    }
}

type MakeInput = {
    body?: string;
    status?: number;
    headers?: { [key: string]: string };
};

export class Response {
    public status: number;
    public headers: Headers;

    private response: FetchResponse;
    private bodyJSon?: Object;
    private bodyText?: string;

    constructor(response: FetchResponse) {
        this.status = response.status;
        this.headers = new Headers(response.headers);
        this.response = response;
    }

    async text(): Promise<string> {
        if (!this.bodyText) {
            this.bodyText = await this.response.text();
        }

        return this.bodyText;
    }

    async json(): Promise<Object> {
        if (!this.bodyJSon) {
            this.bodyJSon = (await this.response.json()) as Object;
        }

        return this.bodyJSon;
    }
}
