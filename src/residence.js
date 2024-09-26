const { MAXIMUM_OCCUPANCY, INITIAL_BALANCE, MINIMUM_MEMBERS_REQUIRED } = require('./constants');
const Store = require('./store');


const createResidence = (store) => {

    const HOUSEMATE_MESSAGES = {
        SUCCESS: 'SUCCESS',
        HOUSEFUL: 'HOUSEFUL',
        MEMBER_NOT_FOUND: 'MEMBER_NOT_FOUND',
    }

    const CLEAR_DUE_MESSAGES = {
        INVALID_PAYMENT: 'INCORRECT_PAYMENT'
    }

    const addMember = (name) => {
        if (store.can_add()) {
            return HOUSEMATE_MESSAGES.HOUSEFUL;
        }
        store.init(name)
        return HOUSEMATE_MESSAGES.SUCCESS;
    };

    const SPEND_MESSAGES = {
        SUCCESS: 'SUCCESS'
    }

    const spend = (amount, spent_by, ...on_members) => {
        // How about a case when there are on_members
        if (store.can_spend()) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        const housemates = new Set(store.housemates().map(housemate => housemate.toLowerCase()));
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
            store.update(spent_by, store.get(spent_by) - individual_share);
            store.update(member, store.get(member) + individual_share);
        }
        return SPEND_MESSAGES.SUCCESS;
    };

    const settleDebts = () => {
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
        const housemates = new Set(store.housemates().map(housemate => housemate.toLowerCase()));
        if (!housemates.has(housemate.toLowerCase())) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        const transactions = settleDebts();

        const housemate_dues = transactions.filter(t => t.to === housemate)

        const current_housemates = new Set(housemate_dues.map(h => h.from).concat(housemate))
        const all_housemates = new Set(store.housemates())

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

    const MOVE_OUT_MESSAGES = {
        FAILURE: 'FAILURE',
        SUCCESS: 'SUCCESS',
    }

    const canMoveOut = (member) => {
        const memberBalance = store.get(member);

        if (memberBalance > INITIAL_BALANCE) {
            // Member has dues to clear.
            return false
        }

        let others_totals = INITIAL_BALANCE;
        for (const [otherMember, balance] of store.get_balances()) {
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
        const housemates = new Set(store.housemates().map(housemate => housemate.toLowerCase()));
        if (!housemates.has(member.toLowerCase())) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        const result = canMoveOut(member);
        if (result) {
            store.remove(member);
            return MOVE_OUT_MESSAGES.SUCCESS;
        } else {
            return MOVE_OUT_MESSAGES.FAILURE;
        }
    }

    return {
        addMember,
        spend,
        settleDebts,
        getBalances: () => Object.fromEntries(store.get_balances()),
        dues,
        clearDue,
        moveOut,
        housemates: () => store.housemates(),
        house_full: () => store.is_full(),
        occupants_count: () => store.housemate_count(),
        reset: () => Store.reset(),
    };
};

module.exports = { createResidence }