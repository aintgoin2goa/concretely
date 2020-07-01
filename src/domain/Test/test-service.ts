import { Test, TestResult } from './';
import { RequestService } from '../Request';
import { ExpectationService } from '../Expectation';

export const execute = async (test: Test): Promise<TestResult> => {
    const { request, expectation } = test;
    const response = await RequestService.send(request);
    const executeExpectations = ExpectationService.test(expectation);
    const result = await executeExpectations(response);
    return {
        name: test.name,
        passed: result.passed,
        errors: result.errors || [],
    };
};
