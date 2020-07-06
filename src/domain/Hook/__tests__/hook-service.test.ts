import { Response } from '../../Response';
import {
    syntheticResponse,
    SyntheticResponseInput,
} from '../../Response/__mocks__/Response';
import { RequestService, Request } from '../../Request';
import { Hook, HookService, ExtractionError } from '../';
import { SessionService } from '../../Session';

const requestServiceSendSpy = jest.spyOn(RequestService, 'send');

type TestCase = [string, Hook, Response, Map<string, string> | ExtractionError];

describe('Hook Service', () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });
    const buildHook = (hook: Partial<Hook> = {}): Hook => {
        return {
            request: {
                method: 'GET',
                url: 'url',
            },
            save: {},
            ...hook,
        };
    };

    const buildResponse = (
        response: Partial<SyntheticResponseInput> = {},
    ): Response => {
        const input: SyntheticResponseInput = {
            status: 200,
            headers: {},
            body: '',
            ...response,
        };

        return syntheticResponse(input);
    };

    const testCases: TestCase[] = [
        [
            'basic example - extract Authorization header',
            buildHook({ save: { token: 'headers.authorization' } }),
            buildResponse({ headers: { Authorization: 'token' } }),
            new Map([['token', 'token']]),
        ],
        [
            'extract from headers and body',
            buildHook({
                save: {
                    token: 'headers.authorization',
                    referrer: 'headers.referer',
                    name: 'body.foo.bar.users.0',
                },
            }),
            buildResponse({
                headers: { Authorization: 'token', Referer: 'mysite' },
                body: JSON.stringify({
                    foo: { bar: { users: ['Bob', 'fred'] } },
                }),
            }),
            new Map([
                ['token', 'token'],
                ['referrer', 'mysite'],
                ['name', 'Bob'],
            ]),
        ],
        [
            'Error - valid header but invalid body extraction',
            buildHook({
                save: {
                    token: 'headers.authorization',
                    referrer: 'headers.referer',
                    name: 'body.foo.bar.user.0',
                },
            }),
            buildResponse({
                headers: { Authorization: 'token', Referer: 'mysite' },
                body: JSON.stringify({
                    foo: { bar: { users: ['Bob', 'fred'] } },
                }),
            }),
            new ExtractionError(
                'body',
                'foo.bar.user.0',
                'value is null or undefined',
            ),
        ],
    ];

    describe.each(testCases)('%s', (_, hook, response, expected) => {
        requestServiceSendSpy.mockResolvedValueOnce(response);

        if (expected instanceof ExtractionError) {
            it('should throw the expected error', async () => {
                expect(() => HookService.execute(hook)).rejects.toEqual(
                    expected,
                );
            });
        } else {
            it('should save the expected values', async () => {
                await HookService.execute(hook);
                for (const [key, expectedValue] of expected.entries()) {
                    const savedValued = SessionService.getFromSession<
                        typeof expectedValue
                    >(key);
                    expect(savedValued).toEqual(expectedValue);
                }
            });
        }
    });
});
