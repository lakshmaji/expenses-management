const { INITIAL_BALANCE } = require("../../constants");

function computeTransactions(creditors, debtors) {
    const transactions = [];
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
    return transactions
}

module.exports = computeTransactions