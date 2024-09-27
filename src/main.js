const fs = require("fs")

const { FILENAME_POSITION } = require('./constants');
const { commandParser } = require('./cmd');

function main() {
    const filename = process.argv[FILENAME_POSITION]

    fs.readFile(filename, {}, (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        commandParser(data.toString());
    })
}

module.exports = { main }