
export interface Headers {
    get: (name: string) => string | null;
    keys: () => IterableIterator<string>;
}

export interface Response {
    status: number;
    headers: Headers;
    body: {
        text: () => Promise<string>,
        json: () => Promise<Object | null>
    }
}