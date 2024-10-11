const { HOUSEMATE_MESSAGES } = require("../../../messages");
const StoreMeta = require("../../store_meta");

class AddMemberValidator {
    constructor() {
        this.store_meta = new StoreMeta();
    }

    validate() {
        if (this.store_meta.can_add()) {
            return HOUSEMATE_MESSAGES.HOUSEFUL;
        }
    }
}

module.exports = AddMemberValidator;
