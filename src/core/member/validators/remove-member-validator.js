const { HOUSEMATE_MESSAGES, MOVE_OUT_MESSAGES } = require("../../../messages");
const { has_housemate, hasDues, owedToSomeone } = require("./validations");
const Store = require("../../../data/store");
const StoreMeta = require("../../store_meta");

class RemoveMemberValidator {
    constructor() {
        this.store_meta = new StoreMeta()
        this.store = new Store()
    }

    validate(name) {
        if (!has_housemate(name)) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        const balance = this.store.get(name)
        if (hasDues(balance)) {
            return MOVE_OUT_MESSAGES.FAILURE;
        }

        const members_balances = this.store.get_balances()
        if (owedToSomeone(name, members_balances, balance)) {
            return MOVE_OUT_MESSAGES.FAILURE;
        }
    }
}

module.exports = RemoveMemberValidator