const { INITIAL_BALANCE } = require("../../constants");
const { SPEND_MESSAGES, CLEAR_DUE_MESSAGES } = require("../../messages");
const Store = require("../../data/store");
const StoreMeta = require("../store_meta");
const computeTransactions = require("./utils");

class Finance {
    constructor() {
        this.store = new Store()
        this.store_meta = new StoreMeta()
    }

    spend(amount, spent_by, ...on_members) {
        this.shareExpenses(amount, spent_by, ...on_members)
        return SPEND_MESSAGES.SUCCESS;
    }

    processPayment(borrower, lender, amount) {
        const payerBalance = this.store.get(borrower);
        const payeeBalance = this.store.get(lender);
    
        if (payerBalance < amount) {
            return CLEAR_DUE_MESSAGES.INVALID_PAYMENT;
        }
    
        this.store.update(borrower, payerBalance - amount);
        this.store.update(lender, payeeBalance + amount);
        return this.transactions().filter(e => e.from === lender && e.to === borrower).reduce((acc, v) => acc + v.amount, INITIAL_BALANCE)
    }

    shareExpenses(amount, spent_by, ...on_members) {
        let total_members = on_members.length;
        // Include spender
        total_members++
        const individual_share = amount / total_members;
    
        for (const member of on_members) {
            this.store.update(spent_by, this.store.get(spent_by) - individual_share);
            this.store.update(member, this.store.get(member) + individual_share);
        }
    }

    transactions()  {
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
    };

    transactionsByMember(name) {
        return this.transactions().filter(transaction => transaction.to === name)
    }
}

module.exports = Finance