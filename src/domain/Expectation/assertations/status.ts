import { ExpectionFailedError } from '..';
import { ComparisonOperators, StatusExpectation } from '../expectation';
import {Response} from '../../Response';

const exact = (expected: number, actual: number) => {
    if (expected !== actual) {
        throw new ExpectionFailedError('status', ComparisonOperators.EQUALS, 'status', expected, actual);
    }
}

const fuzzy = (expected: string, actual: number) => {
    if (String(actual)[0] !== expected[0]) {
        throw new ExpectionFailedError('status', ComparisonOperators.MATCHES, 'status', expected, actual);
    }
}

type AssertStatus = (input: StatusExpectation) => (response: Response) => void;

const assertStatus: AssertStatus = ({operator,  expected}) => (response: Response) => {
    const actual = response.status;
    if(operator === ComparisonOperators.EQUALS) {
        if (typeof expected !== 'number') {
            throw new TypeError('expected must be a number for exact matching');
        } 
        exact(expected, actual);
    }
    if(operator === ComparisonOperators.MATCHES) {
        if (typeof expected !== 'string') {
            throw new TypeError('expected must be a string for fuzzy matching');
        } 
        fuzzy(expected, actual);
    }
}

export default assertStatus;

