import { Expectation, ExpectionFailedError } from '.';
import { Response } from '../Response';
import assertStatus from './assertations/status';
import assertHeader from './assertations/header';
import assertBodyJson from './assertations/json-body';

export type TestResult = {
    passed: boolean;
    errors?: ExpectionFailedError[];
};

export type AssertFunc = (response: Response) => void;

const executeStage = async (
    assertFuncs: AssertFunc[],
    response: Response,
): Promise<TestResult> => {
    const errors: ExpectionFailedError[] = [];
    for (const func of assertFuncs) {
        try {
            await func(response);
        } catch (e) {
            if (e instanceof ExpectionFailedError) {
                errors.push(e);
            } else {
                throw e;
            }
        }
    }

    return errors.length ? { passed: false, errors } : { passed: true };
};

const executeAll = (assertFuncs: AssertFunc[][]) => async (
    response: Response,
): Promise<TestResult> => {
    for (const stage of assertFuncs) {
        const result = await executeStage(stage, response);
        if (!result.passed) {
            return result;
        }
    }
    return { passed: true };
};

export const test = (
    expectationConfig: Expectation,
): ((response: Response) => Promise<TestResult>) => {
    const assertFuncs: AssertFunc[][] = [];
    if (expectationConfig.status) {
        assertFuncs.push([assertStatus(expectationConfig.status)]);
    }
    if (expectationConfig.headers) {
        assertFuncs.push(
            expectationConfig.headers.map((config) => assertHeader(config)),
        );
    }
    if (expectationConfig.body) {
        if (expectationConfig.body.json) {
            assertFuncs.push(
                expectationConfig.body.json.map((config) =>
                    assertBodyJson(config),
                ),
            );
        }
    }

    return executeAll(assertFuncs);
};
