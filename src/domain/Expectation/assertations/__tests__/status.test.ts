import { StatusExpectation, ComparisonOperators } from '../../expectation';
import { ExpectionFailedError } from '../..';
import { Response } from '../../../Response';
import { syntheticResponse } from '../../../Response/__mocks__/Response';

import assertStatus from '../status';

const makeResponse = (status: number): Response => {
    return syntheticResponse({ status });
};

const makeError = (expectation: StatusExpectation, actual: unknown) =>
    new ExpectionFailedError(
        'status',
        expectation.operator,
        'status',
        expectation.expected,
        actual,
    );

describe('Status Assertation', () => {
    type TestCase = [StatusExpectation, Response, boolean];
    const testCases: TestCase[] = [
        [
            { operator: ComparisonOperators.EQUALS, expected: 200 },
            makeResponse(200),
            true,
        ],
        [
            { operator: ComparisonOperators.EQUALS, expected: 200 },
            makeResponse(404),
            false,
        ],
        [
            { operator: ComparisonOperators.EQUALS, expected: 200 },
            makeResponse(201),
            false,
        ],
        [
            { operator: ComparisonOperators.MATCHES, expected: '2XX' },
            makeResponse(201),
            true,
        ],
        [
            { operator: ComparisonOperators.MATCHES, expected: '2**' },
            makeResponse(301),
            false,
        ],
        [
            { operator: ComparisonOperators.MATCHES, expected: '2' },
            makeResponse(500),
            false,
        ],
    ];

    describe.each(testCases)(
        'if expectation config is %j',
        (expectation, response, success) => {
            describe(`and response status is ${response.status}`, () => {
                it(`should ${
                    !success ? 'throw expected error' : 'not throw an error'
                }`, () => {
                    const assert = assertStatus(expectation);
                    if (success) {
                        expect(() => assert(response)).not.toThrow();
                    } else {
                        const expectedError = makeError(
                            expectation,
                            response.status,
                        );
                        expect(() => assert(response)).toThrow(expectedError);
                    }
                });
            });
        },
    );

    describe('Expectation config', () => {
        describe('if operator is MATCHES and expected is a number', () => {
            it('should throw a TypeError', () => {
                const response = makeResponse(200);
                expect(() =>
                    assertStatus({
                        operator: ComparisonOperators.MATCHES,
                        expected: 200,
                    }),
                ).toThrow(TypeError);
            });
        });
        describe('if operator is EQUALS and expected is a string', () => {
            it('should throw a TypeError', () => {
                const response = makeResponse(200);
                expect(() =>
                    assertStatus({
                        operator: ComparisonOperators.EQUALS,
                        expected: '2xx',
                    }),
                ).toThrow(TypeError);
            });
        });
    });
});
