const CommandProcessor = require("./command-processor");

class ExpensesManager {

  constructor(content) {
    this.content = content
    // load services here
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

module.exports = ExpensesManager;
