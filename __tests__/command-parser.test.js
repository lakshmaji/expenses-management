const { commandParser } = require("../src/cmd");

const TEST_CASES = require("../spec_helpers/testcases");
const helpers = require("../spec_helpers/common.utils");
const expenses = require("../spec_helpers/expenses.utils");
const Store = require("../src/data/store");

describe("commandParser", () => {
    let consoleLogSpy;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        Store.reset();
    });

    it("Invalid command", () => {
        const input = "BELLO";

        commandParser(input);

        expect(consoleLogSpy).toHaveBeenCalledWith("Unknown command");
    });

    TEST_CASES.forEach((test_case) => {
        it(test_case.title, () => {
            const expected_output = test_case.output.map((line) => {
                if (helpers.isNumber(line)) {
                    return [+line];
                }
                const words = line.split(" ");
                if (words.length === expenses.RESIDENCE.CAPACITY.SMALL) {
                    // Check for combination of word and number,
                    // then it will be due for some member
                    const [member, amount] = words;
                    if (helpers.isNumber(amount) && !helpers.isNumber(member)) {
                        return [line];
                    }
                }
                return words.map((word) => {
                    if (helpers.isNumber(word)) {
                        return +word;
                    }
                    return word;
                });
            });

            commandParser(Buffer.from(test_case.input.join("\n")).toString());

            expect(consoleLogSpy.mock.calls).toEqual(expected_output);
        });
    });
});
