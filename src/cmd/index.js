const ExpensesManager = require("./expenses-manager");

function commandParser(data) {
  const manager = new ExpensesManager(data)
  manager.handleInstructions()
}

module.exports = { commandParser };
