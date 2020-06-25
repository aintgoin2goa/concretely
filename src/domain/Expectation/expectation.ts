
export enum ComparisonOperators{
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
}

type BodyStringExpection = {
    operator: ComparisonOperators;
    value: string;
}

type BodyJsonExpection = {
    operator: ComparisonOperators;
    path: string;
    value: any;
}

type BodyExpectation = {
    string?: BodyStringExpection[];
    json?: BodyJsonExpection[];
}

export type StatusExpectation = {
    operator: ComparisonOperators;
    expected: number | string;
}

export type Expectation = {
    status?: StatusExpectation;
    headers?: HeaderExpectation[];
    body?: BodyExpectation;
}