import { ExpectionFailedError } from '..';
import { ComparisonOperators, StatusExpectation } from '../expectation';
import { Response } from '../../Response';
import { TestResult } from '../expectation-service';

const exact = (expected: number) => (response: Response) => {
    const actual = response.status;
    if (expected !== actual) {
        throw new ExpectionFailedError(
            'status',
            ComparisonOperators.EQUALS,
            'status',
            expected,
            actual,
        );
    }
};

const fuzzy = (expected: string) => (response: Response) => {
    const actual = response.status;
    if (String(actual)[0] !== expected[0]) {
        throw new ExpectionFailedError(
            'status',
            ComparisonOperators.MATCHES,
            'status',
            expected,
            actual,
        );
    }
};

type AssertStatus = (input: StatusExpectation) => (response: Response) => void;

const assertStatus: AssertStatus = ({ operator, expected }) => {
    if (operator === ComparisonOperators.EQUALS) {
        if (typeof expected !== 'number') {
            throw new TypeError('expected must be a number for exact matching');
        }
        return exact(expected);
    }
    if (operator === ComparisonOperators.MATCHES) {
        if (typeof expected !== 'string') {
            throw new TypeError('expected must be a string for fuzzy matching');
        }
        return fuzzy(expected);
    }

    throw new TypeError('operator must be EQUALS or MATCHES');
};

export default assertStatus;
