import { Test, TestResult } from './';
import { RequestService } from '../Request';
import { ExpectationService } from '../Expectation';
import { HookService } from '../Hook';

export const execute = async (test: Test): Promise<TestResult> => {
    const { request, expectation, before, after } = test;
    if (before) {
        await HookService.execute(before);
    }
    const response = await RequestService.send(request);
    if (after) {
        await HookService.execute(after);
    }
    const executeExpectations = ExpectationService.test(expectation);
    const result = await executeExpectations(response);
    return {
        name: test.name,
        passed: result.passed,
        errors: result.errors || [],
    };
};
