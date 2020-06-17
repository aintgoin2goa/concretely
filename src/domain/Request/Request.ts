export type Request = {
    method: 'GET' | 'POST' | 'DELETE' | 'PUT';
    url: string;
    headers?: {[name: string]: string};
    body?: string;
}