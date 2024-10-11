const { INITIAL_BALANCE } = require("../../../constants");
const StoreMeta = require("../../store_meta");

const has_housemate = (member) => {
    const store_meta = new StoreMeta();
    const housemates = new Set(
        store_meta.housemates().map((housemate) => housemate.toLowerCase())
    );
    return housemates.has(member.toLowerCase());
};

const valid_members = (members) => {
    return members.every(has_housemate);
};

const hasDues = (member_balance) => {
    return member_balance > INITIAL_BALANCE;
};

function owedToSomeone(member, members_balances, memberBalance) {
    let others_totals = INITIAL_BALANCE;
    for (const [otherMember, balance] of members_balances) {
        if (otherMember !== member) {
            others_totals += balance;
        }
    }
    // If truthy then this member doesn't owes anyone else owed by someone
    return !(
        others_totals === INITIAL_BALANCE && memberBalance === INITIAL_BALANCE
    );
}

module.exports = { has_housemate, valid_members, hasDues, owedToSomeone };
