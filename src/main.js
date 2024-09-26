const fs = require("fs")

const { FILENAME_POSITION } = require('./constants');
const { commandParser } = require('./command_parser');

function main() {
    const filename = process.argv[FILENAME_POSITION]

    fs.readFile(filename, {}, (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        const inputLines = data.toString().split('\n').filter(line => line.trim() !== '');
        commandParser(inputLines);
    })
}

module.exports = { main }