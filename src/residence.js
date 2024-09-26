const { addMember } = require('./add-member');
const { clearDue } = require('./clear-due');
const { dues } = require('./dues');
const { moveOut } = require('./move_out');
const { spend } = require('./spend');
const Store = require('./store');
const { settleDebts } = require('./transactions');


const createResidence = (store) => {
    const _addMember = (name) => addMember(store, name)
    const _spend = (...input) => spend(store, ...input);
    const _dues = (housemate) => dues(store, housemate)
    const _clearDue = (borrower, lender, amount) => clearDue(store, borrower, lender, amount)
    const _moveOut = (member) => moveOut(store, member)

    const _settleDebts = () => settleDebts(store)

    return {
        addMember: _addMember,
        spend: _spend,
        settleDebts: _settleDebts,
        getBalances: () => Object.fromEntries(store.get_balances()),
        dues: _dues,
        clearDue: _clearDue,
        moveOut: _moveOut,
        housemates: () => store.housemates(),
        house_full: () => store.is_full(),
        occupants_count: () => store.housemate_count(),
        reset: () => Store.reset(),
    };
};

module.exports = { createResidence }