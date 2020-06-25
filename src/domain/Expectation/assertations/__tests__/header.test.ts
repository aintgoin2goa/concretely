import { ComparisonOperators } from "../../expectation";
import { ExpectionFailedError, HeaderExpectation } from "../..";
import { Response } from "../../../Response";
import assertHeader from "../header";

type HeaderOverrides = { [key: string]: string };

const makeResponse = (headerOverrides: HeaderOverrides): Response => {
  const headers = new Headers();
  Object.keys(headerOverrides).forEach((name) => {
    const value = headerOverrides[name];
    headers.set(name, value);
  });
  return {
    status: 200,
    headers,
    body: {
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(""),
    },
  };
};

const makeError = (
  operator: ComparisonOperators,
  name: string,
  expected: string,
  actual: string
): ExpectionFailedError => {
  return new ExpectionFailedError("header", operator, name, expected, actual);
};

describe(" Header Assertations", () => {
  type TestCase = [string, string, ComparisonOperators, string, boolean];
  const testCases: TestCase[] = [
    ["name", "", ComparisonOperators.EXISTS, "foo", false],
    ["name", "", ComparisonOperators.EXISTS, "", true],
    ["name", "bob", ComparisonOperators.EQUALS, "bob", false],
    ["name", "fred", ComparisonOperators.EQUALS, "bob", true],
    ["name", "freddie", ComparisonOperators.BEGINS_WITH, "fred", false],
    ["name", "freddie", ComparisonOperators.BEGINS_WITH, "bob", true],
    ["name", "freddie", ComparisonOperators.ENDS_WITH, "die", false],
    ["name", "freddie", ComparisonOperators.ENDS_WITH, "bob", true],
    ["name", "james", ComparisonOperators.INCLUDES, "aMe", false],
    ["name", "james", ComparisonOperators.INCLUDES, "aim", true],
    ["name", "john-boy", ComparisonOperators.MATCHES, "^john.boy$", false],
    ["name", "john-boy", ComparisonOperators.MATCHES, "^johnboy$", true],
  ];
  describe.each(testCases)(
    "header %s is %s",
    (headerName, actual, operator, expected, shouldThrow) => {
      const headers: HeaderOverrides = {};
      if (actual) {
        headers[headerName] = actual;
      }
      const response = makeResponse(headers);
      describe(`and expectation is ${operator} ${expected}`, () => {
        const config: HeaderExpectation = {
          name: headerName,
          operator,
          value: expected,
        };
        let assertation: (r: Response) => void;
        beforeAll(() => {
          assertation = assertHeader(config);
        });
        if (shouldThrow) {
          it("should throw an error", () => {
            const expectedError = makeError(
              operator,
              headerName,
              expected,
              actual
            );
            expect(() => assertation(response)).toThrow(expectedError);
          });
        } else {
          it("should not throw an error", () => {
            expect(() => assertation).not.toThrow();
          });
        }
      });
    }
  );
});
