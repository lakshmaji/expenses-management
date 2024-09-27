const { HOUSEMATE_MESSAGES } = require("../../../messages");
const { has_housemate, valid_members } = require("./validations");
const StoreMeta = require("../../store_meta");

class MemberSpendValidator {
    constructor() {
        this.store_meta = new StoreMeta();
    }

    validate(spent_by, on_members) {
        // How about a case when there are on_members
        if (this.store_meta.can_spend()) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        if (!has_housemate(spent_by)) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        if (!valid_members(on_members)) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }
    }
}

module.exports = MemberSpendValidator;
