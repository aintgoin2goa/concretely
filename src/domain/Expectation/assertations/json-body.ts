import { BodyJsonExpectation, ComparisonOperators } from '../expectation';
import { Response } from '../../Response';
import { get, has } from 'object-path';
import deepEqual from 'deep-equal';
import { ExpectionFailedError } from '..';

const assertJsonBody = (config: BodyJsonExpectation) => async (
    response: Response,
) => {
    const body = await response.json();
    const expected = config.value;
    let result = true;
    let actual;

    switch (config.operator) {
        case ComparisonOperators.EXISTS:
            result = has(body, config.path);
            break;
        case ComparisonOperators.EQUALS:
            actual = get(body, config.path);
            result = deepEqual(actual, expected, { strict: true });
            break;
    }

    if (!result) {
        throw new ExpectionFailedError(
            'body',
            config.operator,
            config.path,
            expected,
            actual,
        );
    }

    return true;
};

export default assertJsonBody;
