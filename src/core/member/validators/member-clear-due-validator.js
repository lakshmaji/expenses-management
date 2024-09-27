const { HOUSEMATE_MESSAGES } = require("../../../messages");
const { has_housemate } = require("./validations");
const StoreMeta = require("../../store_meta");

class MemberClearDueValidator {
    constructor() {
        this.store_meta = new StoreMeta();
    }

    validate(borrower, lender) {
        if (!has_housemate(borrower)) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }
        if (!has_housemate(lender)) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }
    }
}

module.exports = MemberClearDueValidator;
