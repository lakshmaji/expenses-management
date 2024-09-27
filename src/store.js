const { INITIAL_BALANCE } = require("./constants");

class Store {
    constructor() {
        if (Store.instance) {
            return Store.instance
        }
        this.balances = new Map();
        Store.instance = this;
    }

    add(housemate) {
        this.balances.set(housemate, INITIAL_BALANCE)
    }

    update(housemate, amount) {
        this.balances.set(housemate, amount);
    }

    remove(housemate) {
        this.balances.delete(housemate);
    }

    get(housemate) {
        return this.balances.get(housemate)
    }

    get_balances() {
        return this.balances
    }

    static reset() {
        Store.instance = null;
    }

}

module.exports = Store;