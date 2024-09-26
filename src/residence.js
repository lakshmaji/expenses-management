const { MAXIMUM_OCCUPANCY, INITIAL_BALANCE, MINIMUM_MEMBERS_REQUIRED } = require('./constants');

const createResidence = () => {

    const HOUSEMATE_MESSAGES = {
        SUCCESS: 'SUCCESS',
        HOUSEFUL: 'HOUSEFUL',
        MEMBER_NOT_FOUND: 'MEMBER_NOT_FOUND',
    }

    const CLEAR_DUE_MESSAGES = {
        INVALID_PAYMENT: 'INCORRECT_PAYMENT'
    }

    const balances = new Map();

    const addMember = (name) => {
        if (balances.size >= MAXIMUM_OCCUPANCY) {
            return HOUSEMATE_MESSAGES.HOUSEFUL;
        }
        balances.set(name, INITIAL_BALANCE);
        return HOUSEMATE_MESSAGES.SUCCESS;
    };

    const SPEND_MESSAGES = {
        SUCCESS: 'SUCCESS'
    }

    const spend = (amount, spent_by, ...on_members) => {
        // How about a case when there are on_members
        if (balances.size < MINIMUM_MEMBERS_REQUIRED) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        const housemates = new Set(Array.from(balances.keys()).map(housemate => housemate.toLowerCase()));
        if (!housemates.has(spent_by.toLowerCase())) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;

        }

        const valid_members = on_members.every(member => housemates.has(member.toLowerCase()));

        if (!valid_members) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;

        }


        let total_members = on_members.length;
        // Include spender
        total_members++
        const individual_share = amount / total_members;

        for (const member of on_members) {
            balances.set(spent_by, balances.get(spent_by) - individual_share);
            balances.set(member, balances.get(member) + individual_share);
        }
        return SPEND_MESSAGES.SUCCESS;
    };

    const settleDebts = () => {
        const transactions = [];

        const creditors = [];
        const debtors = [];

        for (const [member, balance] of balances) {
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

    function excluded_housemates(setA, setB) {
        const difference = new Set();

        setA.forEach(item => {
            if (!setB.has(item)) {
                difference.add(item);
            }
        });

        return difference;
    }
    const dues = (housemate) => {
        const housemates = new Set(Array.from(balances.keys()).map(housemate => housemate.toLowerCase()));
        if (!housemates.has(housemate.toLowerCase())) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        const transactions = settleDebts();

        const housemate_dues = transactions.filter(t => t.to === housemate)

        const current_housemates = new Set(housemate_dues.map(h => h.from).concat(housemate))
        const all_housemates = new Set(Array.from(balances.keys()))

        const diff = excluded_housemates(all_housemates, current_housemates)
        result = housemate_dues.concat(Array.from(diff, (e) => ({ from: e, amount: INITIAL_BALANCE })))

        result.sort((a, b) => {
            if (b.amount !== a.amount) {
                return b.amount - a.amount;
            }
            return a.from.localeCompare(b.from)
        })


        return result

    }

    const clearDue = (borrower, lender, amount) => {
        amount = parseInt(amount)
        const housemates = new Set(Array.from(balances.keys()).map(housemate => housemate.toLowerCase()));
        if (!housemates.has(borrower.toLowerCase())) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;

        }
        if (!housemates.has(lender.toLowerCase())) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        const payerBalance = balances.get(borrower);
        const payeeBalance = balances.get(lender);

        if (payerBalance < amount) {
            return CLEAR_DUE_MESSAGES.INVALID_PAYMENT;
        }
        balances.set(borrower, payerBalance - amount);
        balances.set(lender, payeeBalance + amount);
        const due_amount = settleDebts().filter(e => e.from === lender && e.to === borrower).reduce((acc, v) => acc + v.amount, INITIAL_BALANCE)
        return due_amount
    }

    const MOVE_OUT_MESSAGES = {
        FAILURE: 'FAILURE',
        SUCCESS: 'SUCCESS',
    }

    const canMoveOut = (member) => {
        const memberBalance = balances.get(member);

        if (memberBalance > INITIAL_BALANCE) {
            // Member has dues to clear.
            return false
        }

        let others_totals = INITIAL_BALANCE;
        for (const [otherMember, balance] of balances) {
            if (otherMember !== member) {
                others_totals += balance;
                others_totals += balance;
            }
        }
        if (others_totals === INITIAL_BALANCE && memberBalance === INITIAL_BALANCE) {
            // This member doesn't owes anyone
            return true;
        }
        return false;
    };


    const moveOut = (member) => {
        const housemates = new Set(Array.from(balances.keys()).map(housemate => housemate.toLowerCase()));
        if (!housemates.has(member.toLowerCase())) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        const result = canMoveOut(member);
        if (result) {
            balances.delete(member);
            return MOVE_OUT_MESSAGES.SUCCESS;
        } else {
            return MOVE_OUT_MESSAGES.FAILURE;
        }
    }

    return {
        addMember,
        spend,
        settleDebts,
        getBalances: () => Object.fromEntries(balances),
        dues,
        clearDue,
        moveOut,
        housemates: () => Array.from(balances.keys()),
        house_full: () => MAXIMUM_OCCUPANCY <= balances.size,
        occupants_count: () => balances.size,
        reset: () => balances.clear(),
    };
};

module.exports = { createResidence }