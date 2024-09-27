const { INITIAL_BALANCE } = require("./constants");
const Member = require("./member");
const { CLEAR_DUE_MESSAGES, HOUSEMATE_MESSAGES } = require("./messages");
const Store = require("./store");
const { settleDebts } = require("./transactions");
const { has_housemate } = require("./validations");

const clearDue = (borrower, lender, amount) => {
    // const store = new Store()
    // amount = parseInt(amount)
    // if (!has_housemate(borrower)) {
    //     return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;

    // }
    // if (!has_housemate(lender)) {
    //     return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
    // }

    // return processPayment(store, borrower, lender, amount)
    const member = new Member()
    return member.clearDue(borrower, lender, amount)
}

function processPayment(store, borrower, lender, amount) {
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