const { INITIAL_BALANCE } = require("./constants");
const { HOUSEMATE_MESSAGES, MOVE_OUT_MESSAGES } = require("./messages");
const Store = require("./store");
const { has_housemate } = require("./validations");

const canMoveOut = (store, member) => {
    const memberBalance = store.get(member);

    if (memberBalance > INITIAL_BALANCE) {
        // Member has dues to clear.
        return false
    }

    return owedBySomeone(store, member);
};

function owedBySomeone(store, member) {
    const memberBalance = store.get(member);
    let others_totals = INITIAL_BALANCE;
    for (const [otherMember, balance] of store.get_balances()) {
        if (otherMember !== member) {
            others_totals += balance;
            others_totals += balance;
        }
    }
    // If truthy then this member doesn't owes anyone else owed by someone
    return others_totals === INITIAL_BALANCE && memberBalance === INITIAL_BALANCE
}

const moveOut = (member) => {
    const store = new Store()
    if (!has_housemate(member)) {
        return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
    }

    const result = canMoveOut(store, member);
    if (result) {
        store.remove(member);
        return MOVE_OUT_MESSAGES.SUCCESS;
    } else {
        return MOVE_OUT_MESSAGES.FAILURE;
    }
}


module.exports = { moveOut }