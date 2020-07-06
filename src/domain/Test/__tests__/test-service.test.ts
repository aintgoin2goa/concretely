import { RequestService } from '../../Request';
import { Response } from '../../Response';
import {
    syntheticResponse,
    SyntheticResponseInput,
} from '../../Response/__mocks__/Response';

const sendRequestSpy = jest.spyOn(RequestService, 'send');

import { Test, TestResult, TestService } from '../';
import { ComparisonOperators } from '../../Expectation/expectation';
import { ExpectionFailedError } from '../../Expectation';

type TestCase = [string, Test, Response, TestResult];

const buildTestCaseTest = (test: Partial<Test> = {}): Test => {
    const defaultTest: Test = {
        name: 'name',
        request: {
            method: 'GET',
            url: '/url',
        },
        expectation: {
            status: {
                operator: ComparisonOperators.MATCHES,
                expected: '2XX',
            },
        },
    };

    return { ...defaultTest, ...test };
};

const buildTestCaseResponse = (
    response: Partial<SyntheticResponseInput>,
): Response => {
    const defaultResponse: SyntheticResponseInput = {
        status: 200,
    };
    const merged = { ...defaultResponse, ...response };
    return syntheticResponse(merged);
};

const buildTestCaseResult = (
    result: Partial<TestResult>,
    test: Test,
): TestResult => {
    const defaultResult: TestResult = {
        name: test.name,
        passed: true,
        errors: [],
    };

    return { ...defaultResult, ...result };
};

const buildTestCase = (
    name: string,
    testOverrides: Partial<Test> = {},
    responseOverrides: Partial<SyntheticResponseInput> = {},
    resultOverrides: Partial<TestResult> = {},
): TestCase => {
    const test = buildTestCaseTest(testOverrides);
    const response = buildTestCaseResponse(responseOverrides);
    const result = buildTestCaseResult(resultOverrides, test);
    return [name, test, response, result];
};

describe('Test service', () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });
    const testCases: TestCase[] = [
        buildTestCase('simple status match expectation'),
        buildTestCase(
            'status expectation fails',
            {},
            { status: 404 },
            {
                passed: false,
                errors: [
                    new ExpectionFailedError(
                        'status',
                        ComparisonOperators.MATCHES,
                        'status',
                        '2XX',
                        404,
                    ),
                ],
            },
        ),
        buildTestCase(
            'multiple header and body expectations',
            {
                expectation: {
                    status: {
                        operator: ComparisonOperators.EQUALS,
                        expected: 200,
                    },
                    headers: [
                        {
                            name: 'content-type',
                            operator: ComparisonOperators.INCLUDES,
                            value: 'json',
                        },
                    ],
                    body: {
                        json: [
                            {
                                path: 'foo.bar',
                                operator: ComparisonOperators.EXISTS,
                                value: null,
                            },
                            {
                                path: 'foo.bar',
                                operator: ComparisonOperators.EQUALS,
                                value: { data: [0, 1, 2] },
                            },
                        ],
                    },
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf',
                },
                body: JSON.stringify({
                    foo: {
                        bar: {
                            data: [0, 1, 2, 3],
                        },
                    },
                }),
            },
            {
                passed: false,
                errors: [
                    new ExpectionFailedError(
                        'body',
                        ComparisonOperators.EQUALS,
                        'foo.bar',
                        { data: [0, 1, 2] },
                        { data: [0, 1, 2, 3] },
                    ),
                ],
            },
        ),
    ];
    describe.each(testCases)(
        '%s',
        (_, testConfig, response, expectedResult) => {
            it(`should execute a test and return the result : ${
                expectedResult.passed ? 'PASSED' : 'FAILED'
            }`, async () => {
                sendRequestSpy.mockResolvedValueOnce(response);
                const result = await TestService.execute(testConfig);
                expect(result).toEqual(expectedResult);
            });
        },
    );

    describe('Hooks', () => {
        it('should execute before and after hooks in the correct order', async () => {
            const fakeResponse = syntheticResponse({ status: 200 });
            sendRequestSpy.mockReset();
            sendRequestSpy
                .mockResolvedValueOnce(fakeResponse)
                .mockResolvedValueOnce(fakeResponse)
                .mockResolvedValueOnce(fakeResponse);
            const test: Test = {
                name: 'hook test',
                before: {
                    request: {
                        method: 'GET',
                        url: '/before_url',
                    },
                    save: {},
                },
                request: {
                    method: 'GET',
                    url: '/url',
                },
                expectation: {
                    status: {
                        operator: ComparisonOperators.MATCHES,
                        expected: '2XX',
                    },
                },
                after: {
                    request: {
                        method: 'GET',
                        url: '/after_url',
                    },
                    save: {},
                },
            };
            await TestService.execute(test);
            expect(sendRequestSpy).nthCalledWith(1, test.before!.request);
            expect(sendRequestSpy).nthCalledWith(2, test.request);
            expect(sendRequestSpy).nthCalledWith(3, test.after!.request);
        });
    });
});
