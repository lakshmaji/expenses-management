const { HOUSEMATE_MESSAGES } = require("./messages");
const Store = require("./store");


const addMember = (name) => {
    const store = new Store()
    if (store.can_add()) {
        return HOUSEMATE_MESSAGES.HOUSEFUL;
    }
    store.init(name)
    return HOUSEMATE_MESSAGES.SUCCESS;
};

module.exports = { addMember }