const { HOUSEMATE_MESSAGES } = require("../../../messages");
const { valid_members } = require("./validations");
const StoreMeta = require("../../store_meta");

class MemberClearDueValidator {
    constructor() {
        this.store_meta = new StoreMeta();
    }

    validate(borrower, lender) {
        if (!valid_members([borrower, lender])) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }
    }
}

module.exports = MemberClearDueValidator;
