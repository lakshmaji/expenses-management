const { HOUSEMATE_MESSAGES } = require("./messages");


const addMember = (store, name) => {
    if (store.can_add()) {
        return HOUSEMATE_MESSAGES.HOUSEFUL;
    }
    store.init(name)
    return HOUSEMATE_MESSAGES.SUCCESS;
};

module.exports = { addMember }