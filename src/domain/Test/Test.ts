import { Request } from '../Request';
import { Hook } from '../Hook';
import { Expectation, ExpectionFailedError } from '../Expectation';

export type Save = {
    [key: string]: string;
};

export type Test = {
    name: string;
    before?: Hook;
    after?: Hook;
    request: Request;
    expectation: Expectation;
};

export type TestResult = {
    name: string;
    passed: boolean;
    errors: ExpectionFailedError[];
};
