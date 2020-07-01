import { CustomError } from 'ts-custom-error';
import { ComparisonOperators } from './expectation';

const comparisonToString = (comparison: ComparisonOperators): string => {
    switch (comparison) {
        case ComparisonOperators.EQUALS:
            return 'equal';
        case ComparisonOperators.INCLUDES:
            return 'include';
        case ComparisonOperators.MATCHES:
            return 'match';
        case ComparisonOperators.BEGINS_WITH:
            return 'begin with';
        case ComparisonOperators.ENDS_WITH:
            return 'end with';
        case ComparisonOperators.EXISTS:
            return 'exist';
    }
};

export default class ExpectionFailedError extends CustomError {
    public expectation: string;
    public comparison: ComparisonOperators;
    public field: string;
    public expected: unknown;
    public actual: unknown;

    constructor(
        expectation: string,
        comparison: ComparisonOperators,
        name: string,
        expected: unknown,
        actual: unknown,
    ) {
        const message = [
            `${expectation}: expected ${name} to ${comparisonToString(
                comparison,
            )}`,
        ];
        if (comparison !== ComparisonOperators.EXISTS) {
            message.push(
                `${JSON.stringify(expected)} but was ${JSON.stringify(actual)}`,
            );
        }
        super(message.join(' '));
        this.expectation = expectation;
        this.comparison = comparison;
        this.field = name;
        this.expected = expected;
        this.actual = actual;
    }
}
