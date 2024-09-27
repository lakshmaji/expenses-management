const { addMember } = require('./add-member');
const { clearDue } = require('./clear-due');
const { dues } = require('./dues');
const { moveOut } = require('./move-out');
const { spend } = require('./spend');
const Store = require('./store');
const { settleDebts } = require('./transactions');

const housemates = () => {
    const store = new Store()
    return store.housemates()
}
const house_full = () => {
    const store = new Store()
    return store.is_full()
}
const occupants_count = () => {
    const store = new Store()
    return store.housemate_count()
}

const getBalances = () => {
    const store = new Store()
    return Object.fromEntries(store.get_balances())
}

const createResidence = () => {
    return {
        addMember,
        clearDue,
        dues,
        moveOut,
        spend,
        settleDebts,
        getBalances,
        housemates,
        house_full,
        occupants_count,
    };
};

module.exports = { createResidence }