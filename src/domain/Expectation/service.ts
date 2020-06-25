import { Expectation, ExpectionFailedError } from './';
import { Response } from '../Response';
import assertStatus from './assertations/status';
import assertHeader from './assertations/header';

export type TestResult = {
    passed: boolean;
    errors?: ExpectionFailedError[];
};

export type AssertFunc = (response: Response) => void;

const executeStage = (
    assertFuncs: AssertFunc[],
    response: Response,
): TestResult => {
    const errors: ExpectionFailedError[] = [];
    try {
        assertFuncs.forEach((f) => f(response));
    } catch (e) {
        if (e instanceof ExpectionFailedError) {
            errors.push(e);
        }
        throw e;
    }

    return errors.length ? { passed: false, errors } : { passed: true };
};

const executeAll = (assertFuncs: AssertFunc[][]) => (
    response: Response,
): TestResult => {
    console.log(assertFuncs);
    for (const stage of assertFuncs) {
        const result = executeStage(stage, response);
        if (!result.passed) {
            return result;
        }
    }
    return { passed: true };
};

export const test = (
    expectationConfig: Expectation,
): ((response: Response) => TestResult) => {
    const assertFuncs: AssertFunc[][] = [];
    if (expectationConfig.status) {
        assertFuncs.push([assertStatus(expectationConfig.status)]);
    }
    if (expectationConfig.headers) {
        assertFuncs.push(
            expectationConfig.headers.map((config) => assertHeader(config)),
        );
    }

    return executeAll(assertFuncs);
};
