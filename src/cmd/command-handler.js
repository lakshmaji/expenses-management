const CommandValidator = require("./command-validator");

function commandMatcher(residence, command) {
  const cmdMatcher = {
    MOVE_IN: residence.addMember,
    SPEND: residence.spend,
    CLEAR_DUE: residence.clearDue,
    DUES: residence.dues,
    MOVE_OUT: residence.moveOut,
  };
  return cmdMatcher[command];
}

class CommandHandler extends CommandValidator {
  constructor(residence, name) {
    super(name)
    this.residence = residence;
    this.name = name;
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
