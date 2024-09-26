const { INITIAL_BALANCE } = require("./constants");
const { HOUSEMATE_MESSAGES, MOVE_OUT_MESSAGES } = require("./messages");

const canMoveOut = (store, member) => {
    const memberBalance = store.get(member);

    if (memberBalance > INITIAL_BALANCE) {
        // Member has dues to clear.
        return false
    }

    let others_totals = INITIAL_BALANCE;
    for (const [otherMember, balance] of store.get_balances()) {
        if (otherMember !== member) {
            others_totals += balance;
            others_totals += balance;
        }
    }
    if (others_totals === INITIAL_BALANCE && memberBalance === INITIAL_BALANCE) {
        // This member doesn't owes anyone
        return true;
    }
    return false;
};


const moveOut = (store, member) => {
    const housemates = new Set(store.housemates().map(housemate => housemate.toLowerCase()));
    if (!housemates.has(member.toLowerCase())) {
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