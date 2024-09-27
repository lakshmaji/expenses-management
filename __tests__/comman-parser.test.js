const { commandParser } = require('../src/command-parser');

const TEST_CASES = require('./test_data/test_data.json');
const Store = require("../src/store");

describe('commandParser', () => {
    let store;
    let consoleLogSpy;

    beforeEach(() => {
        store = new Store()
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        Store.reset()
    });

    it('Invalid command', () => {
        const input = ['BELLO']

        commandParser(input)

        expect(consoleLogSpy).toHaveBeenCalledWith('Unknown command')
    });

    TEST_CASES.forEach(test_case => {
        it(test_case.title, () => {
            const expected_output = test_case.output.map(line => !isNaN(line) && !isNaN(parseInt(line)) ? [+line] : line.split(' ').map(word => !isNaN(word) && !isNaN(parseInt(word)) ? +word : word))

            commandParser(test_case.input)

            expect(consoleLogSpy.mock.calls).toEqual(expected_output)
        });
    })
})
