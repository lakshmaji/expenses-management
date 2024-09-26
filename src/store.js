const { INITIAL_BALANCE, MAXIMUM_OCCUPANCY, MINIMUM_MEMBERS_REQUIRED } = require("./constants");

class Store {
    constructor() {
        if (Store.instance) {
            return Store.instance
        }
        this.balances = new Map();
        Store.instance = this;
    }

    init(housemate) {
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

    can_add() {
        return this.balances.size >= MAXIMUM_OCCUPANCY
    }

    can_spend() {
        return this.balances.size < MINIMUM_MEMBERS_REQUIRED
    }

    is_full() {
        return MAXIMUM_OCCUPANCY <= this.balances.size
    }

    housemate_count() {
        return this.balances.size;
    }

    housemates() {
        return Array.from(this.balances.keys())
    }

    // reset() {
    //     this.balances.clear()
    // }

    static reset() {
        Store.instance = null;
    }

}

module.exports = Store;