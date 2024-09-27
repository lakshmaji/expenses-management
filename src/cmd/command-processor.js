const OutputProcessor = require("../io/output-processor")
const CommandHandler = require("./command-handler")

// Router
class CommandProcessor {
  constructor() {
    this.writer = new OutputProcessor()
  }

  load(line) {
    [this.command, ...this.args] = line.replace(/\r+$/, "").split(" ")
    return this
  }

  // This is router for all expenses commands. 
  process() {
    const command_handler = new CommandHandler(this.command)
    if (command_handler.isValid()) {
      this.result = command_handler.match().execute(...this.args)
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
