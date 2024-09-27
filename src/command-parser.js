const { Residence } = require("./residence");

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

class CommandValidator {
  constructor(name) {
    this.name = name
  }

  isValid() {
    return ["MOVE_IN", "SPEND", "CLEAR_DUE", "DUES", "MOVE_OUT"].includes(
      this.name
    );
  }
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

class ExpensesManager {

  constructor(content) {
    this.content = content
    this.processor = new CommandProcessor()
    this.instructions = this.content.toString().split('\n').filter(line => line.trim() !== '')
  }

  process(instruction) {
    this.processor.load(instruction).process().print()
  }

  handleInstructions() {
    this.instructions.forEach((line) => this.process(line));
  }

}

function commandParser(data) {
  const manager = new ExpensesManager(data)
  manager.handleInstructions()
}

class OutputProcessor {
  write(content) {
    if (Array.isArray(content)) {
      this.writeLines(content)
    } else {
      this.writeLine(content);
    }
  }

  writeLine(line) {
    console.log(line);
  }

  writeLines(lines) {
    lines.forEach(line => {
      this.writeLine(line)
    })
  }
}

class CommandProcessor {
  constructor() {
    this.residence = new Residence()
    this.writer = new OutputProcessor()
  }

  load(line) {
    [this.command, ...this.args] = line.replace(/\r+$/, "").split(" ")
    return this
  }

  process() {
    const command_handler = new CommandHandler(this.residence, this.command)
    if (command_handler.isValid()) {
      this.result = command_handler.match(this.command).execute(...this.args)
    } else {
      this.result = "Unknown command"
    }
    return this
  }

  print() {
    this.writer.write(this.result)
  }
}

module.exports = { commandParser };
