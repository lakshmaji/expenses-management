const { INITIAL_BALANCE } = require("./constants");

class Store {
    constructor() {
        this.balances = new Map(); 
    }

    init(housemate_name) {
        this.balances.set(housemate_name, INITIAL_BALANCE)
    }
}