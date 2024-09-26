const { createResidence } = require("./residence");
const Store = require('./store');

function commandMatcher(residence, command, ...args) {
    const cmdMatcher = {
        MOVE_IN: residence.addMember,
        SPEND: residence.spend,
        CLEAR_DUE: residence.clearDue,
        DUES: residence.dues,
        MOVE_OUT: residence.moveOut,
    };
    const command_handler = cmdMatcher[command];
    if (typeof command_handler === 'undefined') {
        console.log("Unknown command")
        return;
    }
    processCommand(command_handler, ...args);
}

function processCommand(command_handler, ...args) {
    const result = command_handler(...args)
    if (Array.isArray(result)) {
        result.forEach((element) => {
            console.log(element.from, element.amount);
        });
    } else {
        console.log(result);
    }
}

function commandParser(inputLines) {
    const store = new Store()

    const residence = createResidence(store);

    inputLines.forEach((line) => {
        const [command, ...args] = line.replace(/\r+$/, "").split(" ");
        commandMatcher(residence, command, ...args)
    });
}

module.exports = { commandParser };
