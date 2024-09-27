const fs = require("fs")
const { main } = require('../geektrust');

describe('main', () => {
    let argvSpy, consoleErrorSpy;
    const err = new Error('File not found')

    beforeAll(() => {
        argvSpy = process.argv;
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        
        process.argv = ['node', 'script.js', 'sample_input/input.txt'];
        fs.readFile.mockImplementationOnce((filename, encoding, callback) => {
            callback(null, '');
        }).mockImplementation((filename, encoding, callback) => {
            callback(err, null);
        })
    });

    afterAll(() => {
        process.argv = argvSpy;
        consoleErrorSpy.mockRestore();
        jest.clearAllMocks();
    });

    it('should read filename', () => {
        main()
        expect(fs.readFile).toHaveBeenCalledWith('sample_input/input.txt', {}, expect.any(Function));
    })

    it('should return error', () => {
        main()
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error reading the file:', err);
    })
})
