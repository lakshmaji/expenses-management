const { HOUSEMATE_MESSAGES, SPEND_MESSAGES } = require("./messages");


const spend = (store, amount, spent_by, ...on_members) => {
    // How about a case when there are on_members
    if (store.can_spend()) {
        return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
    }

    const housemates = new Set(store.housemates().map(housemate => housemate.toLowerCase()));
    if (!housemates.has(spent_by.toLowerCase())) {
        return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;

    }

    const valid_members = on_members.every(member => housemates.has(member.toLowerCase()));

    if (!valid_members) {
        return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;

    }


    let total_members = on_members.length;
    // Include spender
    total_members++
    const individual_share = amount / total_members;

    for (const member of on_members) {
        store.update(spent_by, store.get(spent_by) - individual_share);
        store.update(member, store.get(member) + individual_share);
    }
    return SPEND_MESSAGES.SUCCESS;
};

module.exports = { spend }