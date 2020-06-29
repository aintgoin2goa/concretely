export enum ComparisonOperators {
    EQUALS = 'EQUALS',
    INCLUDES = 'INCLUDES',
    MATCHES = 'MATCHES',
    BEGINS_WITH = 'BEGINS_WITH',
    ENDS_WITH = 'ENDS_WITH',
    EXISTS = 'EXISTS',
}

export type HeaderExpectation = {
    name: string;
    operator: ComparisonOperators;
    value: string;
};

type BodyStringExpection = {
    operator: ComparisonOperators;
    value: string;
};

export type BodyJsonExpectation = {
    operator: ComparisonOperators;
    path: string;
    value: any;
};

export type BodyExpectation = {
    string?: BodyStringExpection[];
    json?: BodyJsonExpectation[];
};

export type StatusExpectation = {
    operator: ComparisonOperators;
    expected: number | string;
};

export type Expectation = {
    status?: StatusExpectation;
    headers?: HeaderExpectation[];
    body?: BodyExpectation;
};
