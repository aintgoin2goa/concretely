import { TestService, Test, TestResult } from '../../../../src/domain/Test';
import {
    ComparisonOperators,
    Expectation,
} from '../../../../src/domain/Expectation/expectation';
import { ExpectionFailedError } from '../../../../src/domain/Expectation';

const buildTestConfig = (expectationOverride: Partial<Expectation>): Test => {
    const configBase: Test = {
        name: 'testing jsonplaceholder post detail endpoint',
        request: {
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/posts/1',
        },
        expectation: {},
    };

    configBase.expectation = {
        ...configBase.expectation,
        ...expectationOverride,
    };
    return configBase;
};

const expectationsThatShouldPass = {
    status: {
        operator: ComparisonOperators.EQUALS,
        expected: 200,
    },
    headers: [
        {
            name: 'x-ratelimit-limit',
            operator: ComparisonOperators.EXISTS,
            value: '',
        },
        {
            name: 'vary',
            operator: ComparisonOperators.EQUALS,
            value: 'Origin, Accept-Encoding',
        },
    ],
    body: {
        json: [
            {
                operator: ComparisonOperators.EQUALS,
                path: 'userId',
                value: 1,
            },
            {
                operator: ComparisonOperators.EXISTS,
                path: 'body',
                value: null,
            },
        ],
    },
};

const expectationsWithFailure = JSON.parse(
    JSON.stringify(expectationsThatShouldPass),
);
expectationsWithFailure.body.json.push({
    operator: ComparisonOperators.EQUALS,
    path: 'title',
    value: 'this is not the real title',
});

describe('Test Service Integration Tests', () => {
    describe('Passing Test', () => {
        it('should make the request, execute expectations and pass', async () => {
            const passingTestConfig = buildTestConfig(
                expectationsThatShouldPass,
            );
            const expectedResult: TestResult = {
                name: passingTestConfig.name,
                passed: true,
                errors: [],
            };

            const result = await TestService.execute(passingTestConfig);

            expect(result).toEqual(expectedResult);
        });
    });
    describe('Failing Test', () => {
        it('should make a request and correctly execute expectations against the response', async () => {
            const testConfig = buildTestConfig(expectationsWithFailure);
            const expectedResult: TestResult = {
                name: testConfig.name,
                passed: false,
                errors: [
                    new ExpectionFailedError(
                        'body',
                        ComparisonOperators.EQUALS,
                        'title',
                        testConfig.expectation.body!.json![2].value,
                        'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
                    ),
                ],
            };

            const result = await TestService.execute(testConfig);

            expect(result).toEqual(expectedResult);
        });
    });
});
