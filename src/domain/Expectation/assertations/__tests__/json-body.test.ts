import { ComparisonOperators, BodyJsonExpectation } from '../../expectation';
import { Response, Headers } from '../../../Response';
import { syntheticResponse } from '../../../Response/__mocks__/Response';
import assertJsonBody from '../json-body';
import { ExpectionFailedError } from '../..';
import { get } from 'object-path';

const makeResponse = (body: Object): Response => {
    return syntheticResponse({ status: 200, body: JSON.stringify(body) });
};

describe('JSON Body assertions', () => {
    type TestCase = [string, ComparisonOperators, unknown, object, boolean];
    const testCases: TestCase[] = [
        [
            'foo.bar',
            ComparisonOperators.EQUALS,
            'baz',
            { foo: { bar: 'baz' } },
            false,
        ],
        [
            'foo.bar',
            ComparisonOperators.EQUALS,
            'baz',
            { foo: { bar: 'baf' } },
            true,
        ],
        [
            'foo.bar',
            ComparisonOperators.EXISTS,
            undefined,
            { foo: { bar: 'bazzoo' } },
            false,
        ],
        [
            'foo.bar',
            ComparisonOperators.EXISTS,
            undefined,
            { foo: { baf: 'bafffoo' } },
            true,
        ],
    ];
    describe.each(testCases)(
        '%s %s %s',
        (path, operator, expected, bodyObj, shouldThrow) => {
            const response = makeResponse(bodyObj);
            const config: BodyJsonExpectation = {
                path,
                operator,
                value: expected,
            };
            const assert = assertJsonBody(config);
            if (shouldThrow) {
                describe('not in body', () => {
                    it('should throw the expected error', () => {
                        const expectedError = new ExpectionFailedError(
                            'body',
                            operator,
                            path,
                            expected,
                            get(bodyObj, path),
                        );
                        return expect(assert(response)).rejects.toEqual(
                            expectedError,
                        );
                    });
                });
            } else {
                describe('in body', () => {
                    it('should not throw', () => {
                        return expect(assert(response)).resolves.toEqual(true);
                    });
                });
            }
        },
    );
});
