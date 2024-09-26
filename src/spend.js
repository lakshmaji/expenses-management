const { HOUSEMATE_MESSAGES, SPEND_MESSAGES } = require("./messages");
const Store = require("./store");
const { has_housemate, valid_members } = require("./validations");


const spend = (amount, spent_by, ...on_members) => {
    const store = new Store()
    // How about a case when there are on_members
    if (store.can_spend()) {
        return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
    }

    if (!has_housemate(spent_by)) {
        return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
    }

    if (!valid_members(on_members)) {
        return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
    }

    return updateSpend(store, amount, spent_by, ...on_members)
};

function updateSpend(store, amount, spent_by, ...on_members) {
    let total_members = on_members.length;
    // Include spender
    total_members++
    const individual_share = amount / total_members;

    for (const member of on_members) {
        store.update(spent_by, store.get(spent_by) - individual_share);
        store.update(member, store.get(member) + individual_share);
    }
    return SPEND_MESSAGES.SUCCESS;
}

module.exports = { spend }