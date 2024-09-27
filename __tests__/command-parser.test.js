const { commandParser } = require("../src/cmd");

const TEST_CASES = require("../test_data.json");
const { TESTING_CONSTANTS, isNumber } = require("../test.helpers");
const Store = require("../src/data/store");

describe("commandParser", () => {
    let consoleLogSpy;

    beforeEach(() => {
        new Store();
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
                if (isNumber(line)) {
                    return [+line];
                }
                const words = line.split(" ");
                if (words.length === TESTING_CONSTANTS.MEMBER_COUNTS.TWO) {
                    // Check for combination of word and number,
                    // then it will be due for some member
                    const [member, amount] = words;
                    if (isNumber(amount) && !isNumber(member)) {
                        return [line];
                    }
                }
                return words.map((word) => {
                    if (isNumber(word)) {
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
