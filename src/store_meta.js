const { INITIAL_BALANCE, MAXIMUM_OCCUPANCY, MINIMUM_MEMBERS_REQUIRED } = require("./constants");
const Store = require("./store");

// TODO: Rename to House many be
class StoreMeta {

    constructor() {
        this.store = new Store()
    }

    get balances() {
        return this.store.get_balances()
    }

    get current_members_count() {
        return this.balances.size
    }

    can_add() {
        return this.current_members_count >= MAXIMUM_OCCUPANCY
    }

    can_spend() {
        return this.current_members_count < MINIMUM_MEMBERS_REQUIRED
    }

    is_full() {
        return MAXIMUM_OCCUPANCY <= this.current_members_count
    }

    housemate_count() {
        return this.current_members_count;
    }

    housemates() {
        return Array.from(this.balances.keys())
    }
}

module.exports = StoreMeta;