import {resolve as resolvePath} from 'path';
import { readFileSync } from 'fs';

import {RequestService, Request} from '../../../../src/domain/Request';

describe('Request service', () => {
    it('it should make a request and recieve the response', async () => {
        const expectedFile = resolvePath(__dirname, 'expected-posts.json');
        const bodyStr = readFileSync(expectedFile, {encoding:'utf8'});
        const expectedBody = JSON.parse(bodyStr);
        const request: Request = {
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/posts'
        };
        const response = await RequestService.send(request);
        expect(response.status).toEqual(200);
        const body = await response.body.json();
        expect(body).toEqual(expectedBody);
    });
});