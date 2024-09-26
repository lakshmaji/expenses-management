const { addMember } = require('./add-member');
const { clearDue } = require('./clear-due');
const { dues } = require('./dues');
const { moveOut } = require('./move-out');
const { spend } = require('./spend');
const { settleDebts } = require('./transactions');


const createResidence = (store) => {
    return {
        addMember,
        clearDue,
        dues,
        moveOut,
        spend,
        settleDebts,
        getBalances: () => Object.fromEntries(store.get_balances()),
        housemates: () => store.housemates(),
        house_full: () => store.is_full(),
        occupants_count: () => store.housemate_count(),
    };
};

module.exports = { createResidence }