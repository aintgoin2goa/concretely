import { Request } from '../Request';
import { Expectation, ExpectionFailedError } from '../Expectation';

export type Save = {
    [key: string]: string;
};

export type Test = {
    name: string;
    request: Request;
    expectation: Expectation;
};

export type TestResult = {
    name: string;
    passed: boolean;
    errors: ExpectionFailedError[];
};
