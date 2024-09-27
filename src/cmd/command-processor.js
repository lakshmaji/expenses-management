const OutputProcessor = require("../io/output-processor")
const { Residence } = require("../residence")
const CommandHandler = require("./command-handler")


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

module.exports = CommandProcessor;
