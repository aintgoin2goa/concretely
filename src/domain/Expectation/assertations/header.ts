import {HeaderExpectation, ExpectionFailedError} from '../';
import {Response} from '../../Response';
import { ComparisonOperators } from '../expectation';


const throwError = (operator: ComparisonOperators, name: string, expected: string, actual: string) => {
    throw new ExpectionFailedError('header', operator, name, expected, actual);
} 

const exists = (name: string, actual: string) => {
    if(actual === '') {
        throwError(ComparisonOperators.EXISTS, name, '', '');
    }
}

const equals = (name: string, expected: string, actual: string) => {
    exists(name, actual);
    if (actual !== expected) {
        throwError(ComparisonOperators.EQUALS, name, expected, actual);
    }
}

const beginsWith = (name: string, expected: string, actual: string) => {
    exists(name, actual);
    if (!actual.startsWith(expected)){
        throwError(ComparisonOperators.BEGINS_WITH, name, expected, actual);
    }
}

const endsWith = (name: string, expected: string, actual: string) => {
    exists(name, actual);
    if (!actual.endsWith(expected)){
        throwError(ComparisonOperators.ENDS_WITH, name, expected, actual);
    }
}

const includes = (name: string, expected: string, actual: string) => {
    exists(name, actual);
    if (!actual.includes(expected)){
        throwError(ComparisonOperators.INCLUDES, name, expected, actual);
    }
}

const matches = (name: string, expected: string, actual: string) => {
    exists(name, actual);
    const regex = new RegExp(expected, 'i');
    if (!regex.test(actual)){
        throwError(ComparisonOperators.MATCHES, name, expected, actual);
    }
}

const assertHeader = (expectation: HeaderExpectation) => (response: Response) => {
    const name = expectation.name;
    const expected = (expectation.value || '').toLowerCase();
    const actual = (response.headers.get(name) || '').toLowerCase();

    switch(expectation.operator) {
        case ComparisonOperators.EXISTS: return exists(name, actual)
        case ComparisonOperators.EQUALS: return equals(name, expected, actual);
        case ComparisonOperators.BEGINS_WITH: return beginsWith(name, expected, actual);
        case ComparisonOperators.ENDS_WITH: return endsWith(name, expected, actual);
        case ComparisonOperators.INCLUDES: return includes(name, expected, actual);
        case ComparisonOperators.MATCHES: return matches(name, expected, actual);
    }
}

export default assertHeader;