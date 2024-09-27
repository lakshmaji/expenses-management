const fs = require("fs")

const { main } = require('../geektrust');

describe('main', () => {
    let argvSpy, consoleErrorSpy;

    beforeAll(() => {
        argvSpy = process.argv;
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterAll(() => {
        process.argv = argvSpy;
        consoleErrorSpy.mockRestore();
        jest.clearAllMocks();
    });

    it('should read filename', () => {
        jest.spyOn(fs, 'readFile').mockImplementation((filename, encoding, callback) => {
            callback(null, '');
        });

        process.argv = ['node', 'script.js', 'sample_input/input.txt'];

        main()
        expect(fs.readFile).toHaveBeenCalledWith('sample_input/input.txt', {}, expect.any(Function));
    })

    it('should return error', () => {
        const err = new Error('File not found')
        fs.readFile.mockImplementation((filename, encoding, callback) => {
            callback(err, null);
        });
        main()
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error reading the file:', err);
    })
})
