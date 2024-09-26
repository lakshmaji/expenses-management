const { INITIAL_BALANCE } = require("./constants");
const { CLEAR_DUE_MESSAGES, HOUSEMATE_MESSAGES } = require("./messages");
const Store = require("./store");
const { settleDebts } = require("./transactions");

const clearDue = (borrower, lender, amount) => {
    const store = new Store()
    amount = parseInt(amount)
    const housemates = new Set(store.housemates().map(housemate => housemate.toLowerCase()));
    if (!housemates.has(borrower.toLowerCase())) {
        return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;

    }
    if (!housemates.has(lender.toLowerCase())) {
        return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
    }

    const payerBalance = store.get(borrower);
    const payeeBalance = store.get(lender);

    if (payerBalance < amount) {
        return CLEAR_DUE_MESSAGES.INVALID_PAYMENT;
    }
    store.update(borrower, payerBalance - amount);
    store.update(lender, payeeBalance + amount);
    const due_amount = settleDebts().filter(e => e.from === lender && e.to === borrower).reduce((acc, v) => acc + v.amount, INITIAL_BALANCE)
    return due_amount
}

module.exports = { clearDue }