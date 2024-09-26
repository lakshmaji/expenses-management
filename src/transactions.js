const { INITIAL_BALANCE } = require("./constants");
const Store = require("./store");

const settleDebts = () => {
    const store  = new Store()
    const transactions = [];

    const creditors = [];
    const debtors = [];

    for (const [member, balance] of store.get_balances()) {
        if (balance > INITIAL_BALANCE) {
            creditors.push({ member, amount: balance });
        } else if (balance < INITIAL_BALANCE) {
            debtors.push({ member, amount: -balance });
        }
    }

    let i = INITIAL_BALANCE, j = INITIAL_BALANCE;

    while (i < creditors.length && j < debtors.length) {
        const creditor = creditors[i];
        const debtor = debtors[j];
        const amount = Math.min(creditor.amount, debtor.amount);

        transactions.push({
            from: debtor.member,
            to: creditor.member,
            amount
        });

        creditor.amount -= amount;
        debtor.amount -= amount;

        if (creditor.amount === INITIAL_BALANCE) {
            i++;
        }
        if (debtor.amount === INITIAL_BALANCE) {
            j++;
        }
    }

    return transactions;
};

module.exports = { settleDebts }