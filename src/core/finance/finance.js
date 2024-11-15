const { INITIAL_BALANCE } = require("../../constants");
const { SPEND_MESSAGES, CLEAR_DUE_MESSAGES } = require("../../messages");
const Store = require("../../data/store");
const StoreMeta = require("../store_meta");
const { computeTransactions, roundTo, sum } = require("./utils");

class Finance {
    constructor() {
        this.store = new Store();
        this.store_meta = new StoreMeta();
    }

    processPayment(sender, receiver, amount) {
        const payerBalance = this.store.get(sender);
        const payeeBalance = this.store.get(receiver);

        if (payerBalance < amount) {
            return CLEAR_DUE_MESSAGES.INVALID_PAYMENT;
        }

        this.store.update(sender, payerBalance - amount);
        this.store.update(receiver, payeeBalance + amount);
        return sum(
            this.transactions()
                .filter(transaction => transaction.from === receiver && transaction.to === sender)
                .map(transaction => transaction.amount)
        );
    }

    shareExpenses(amount, spent_by, ...on_members) {
        let total_members = on_members.length;
        // Include spender
        total_members++;
        const individual_share = roundTo(amount / total_members);

        for (const member of on_members) {
            this.store.update(spent_by, this.store.get(spent_by) - individual_share);
            this.store.update(member, this.store.get(member) + individual_share);
        }
        return SPEND_MESSAGES.SUCCESS;
    }

    transactions() {
        const creditors = [];
        const debtors = [];

        for (const [member, balance] of this.store.get_balances()) {
            if (balance > INITIAL_BALANCE) {
                creditors.push({ member, amount: balance });
            } else if (balance < INITIAL_BALANCE) {
                debtors.push({ member, amount: -balance });
            }
        }

        return computeTransactions(creditors, debtors);
    }

    transactionsByMember(name) {
        return this.transactions().filter((transaction) => transaction.to === name);
    }
}

module.exports = Finance;
