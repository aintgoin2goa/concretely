jest.mock('node-fetch');
import fetch, {Response as FetchResponse, Headers, ResponseInit, RequestInit} from 'node-fetch';
const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

import {RequestService, Request} from '../index';
import {Response} from '../../Response';

describe('Request Service', () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });
    describe('When I make a request', () => {
        const body = {foo: 'bar'};
        const request: Request = {
            method: 'POST',
            headers: {
                ['expect']: 'application/json',
                ['Content-Type']: 'application.json'
            },
            body: JSON.stringify(body),
            url: 'http://www.url.com/foo/bar',
        };
        let response: Response;
        let mockResponse: FetchResponse;
        beforeAll(async() => {
            mockResponse = new FetchResponse('body');
            mockResponse.status = 200;
            mockResponse.headers = new Headers();
            fetchMock.mockResolvedValue(mockResponse);
            response = await RequestService.send(request);
        });

        it('should pass the request on to fetch', () => {
            const expectedUrl = request.url;
            const expectedRequestInit: RequestInit = {
                method: request.method,
                body: request.body,
                headers: request.headers
            }
            expect(fetchMock).toBeCalledWith(expectedUrl, expectedRequestInit);
        });

        it('should return the response', () => {
            const expected: Response = {
                status: mockResponse.status,
                headers: new Headers(),
                body: {
                    json: () => Promise.resolve({}),
                    text: () => Promise.resolve('')
                }
            }
        });
    })
});