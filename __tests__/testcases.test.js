const { commandParser } = require("../src/cmd");
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

    it("Sample test case", () => {
        const expected_output = [
            "MEMBER_NOT_FOUND",
            "MEMBER_NOT_FOUND",
            "SUCCESS",
            "MEMBER_NOT_FOUND",
            "SUCCESS",
            "MEMBER_NOT_FOUND",
        ].map((line) => {
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

        commandParser(
            Buffer.from(
                [
                    `SPEND ${TESTING_CONSTANTS.MEMBER_COUNTS.FOUR} WOODY ANDY`,
                    "DUES ANDY",
                    "MOVE_IN ANDY",
                    `SPEND ${TESTING_CONSTANTS.MEMBER_COUNTS.THREE} ANDY REX`,
                    "MOVE_OUT ANDY",
                    `CLEAR_DUE ANDY WOODY ${TESTING_CONSTANTS.MEMBER_COUNTS.TWO}`,
                ].join("\n")
            ).toString()
        );

        expect(consoleLogSpy.mock.calls).toEqual(expected_output);
    });
});
