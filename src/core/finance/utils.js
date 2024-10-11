const {
    INITIAL_BALANCE,
    MAXIMUM_OCCUPANCY,
    MINIMUM_MEMBERS_REQUIRED,
} = require("../../constants");

function computeTransactions(creditors, debtors) {
    const transactions = [];
    let i = INITIAL_BALANCE,
        j = INITIAL_BALANCE;

    while (i < creditors.length && j < debtors.length) {
        const creditor = creditors[i];
        const debtor = debtors[j];
        const amount = Math.min(creditor.amount, debtor.amount);

        transactions.push({
            from: debtor.member,
            to: creditor.member,
            amount,
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
}

const roundTo = (amount) => {
    const base =
        ((MAXIMUM_OCCUPANCY + MINIMUM_MEMBERS_REQUIRED) *
            MINIMUM_MEMBERS_REQUIRED) **
        MINIMUM_MEMBERS_REQUIRED;
    return Math.round(amount * base) / base;
};

const sum = (numbers) => numbers.reduce((total, number) => {
    return roundTo(total + number)
}, INITIAL_BALANCE)

module.exports = { computeTransactions, roundTo, sum };
