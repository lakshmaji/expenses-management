const { HOUSEMATE_MESSAGES } = require("../../../messages");
const { has_housemate } = require("./validations");
const Store = require("../../../data/store");
const StoreMeta = require("../../store_meta");

class MemberValidator {
    constructor() {
        this.store_meta = new StoreMeta();
        this.store = new Store();
    }

    validate(name) {
        if (!has_housemate(name)) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }
    }
}

module.exports = MemberValidator;
