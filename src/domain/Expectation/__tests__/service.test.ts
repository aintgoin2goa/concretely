import { Expectation } from '../';
import { ComparisonOperators } from '../expectation';
import assertStatus from '../assertations/status';
import assertHeader from '../assertations/header';
const assertStatusMock = assertStatus as jest.MockedFunction<
    typeof assertStatus
>;
const assertHeaderMock = assertHeader as jest.MockedFunction<
    typeof assertHeader
>;

jest.mock('../assertations/status');
jest.mock('../assertations/header');
import { ExpectationService } from '../';

describe('Expectation Service', () => {
    describe('if there is status in the expectations', () => {
        const config: Expectation = {
            status: {
                operator: ComparisonOperators.EQUALS,
                expected: 200,
            },
        };
        it('should call the status assertation', () => {
            ExpectationService.test(config);
            expect(assertStatusMock).toHaveBeenCalledWith(config.status);
        });
    });
    describe('if there is headers in the expectations', () => {
        const config: Expectation = {
            headers: [
                {
                    name: 'content-type',
                    operator: ComparisonOperators.INCLUDES,
                    value: 'json',
                },
                {
                    name: 'content-length',
                    operator: ComparisonOperators.EQUALS,
                    value: '1024',
                },
                {
                    name: 'foo',
                    operator: ComparisonOperators.EXISTS,
                    value: '',
                },
            ],
        };
        it('should call the header assertation for each one', () => {
            ExpectationService.test(config);
            const headerConfig = config.headers ?? [];
            expect(assertHeaderMock).toHaveBeenCalledTimes(headerConfig.length);
            headerConfig.forEach((config, i) => {
                expect(assertHeaderMock).toHaveBeenNthCalledWith(i + 1, config);
            });
        });
    });
});
