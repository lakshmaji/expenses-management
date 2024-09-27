const Residence = require("../features/residence/residence");
const CommandValidator = require("./command-validator");

function commandMatcher(residence, command) {
    const cmdMatcher = {
        MOVE_IN: residence.addMember.bind(residence),
        SPEND: residence.spend.bind(residence),
        CLEAR_DUE: residence.clearDue.bind(residence),
        DUES: residence.dues.bind(residence),
        MOVE_OUT: residence.moveOut.bind(residence),
    };
    return cmdMatcher[command];
}

class CommandHandler extends CommandValidator {
    constructor(name) {
        super(name);
        this.name = name;
        this.residence = new Residence();
    }

    match() {
        this.handler = commandMatcher(this.residence, this.name);
        return this;
    }

    execute(...args) {
        return this.handler(...args);
    }
}

module.exports = CommandHandler;
