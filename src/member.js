const { INITIAL_BALANCE } = require("./constants");
const Finance = require("./finance");
const { HOUSEMATE_MESSAGES, MOVE_OUT_MESSAGES, SPEND_MESSAGES } = require("./messages");
const Store = require("./store");
const StoreMeta = require("./store_meta");
const { has_housemate, hasDues, owedToSomeone, valid_members } = require("./validations");

class Member {

    constructor() {
        this.store = new Store()
        this.store_meta = new StoreMeta()
        this.finances = new Finance()
    }

    addMember(name) {
        if (this.store_meta.can_add()) {
            return HOUSEMATE_MESSAGES.HOUSEFUL;
        }
        this.store.add(name)
        return HOUSEMATE_MESSAGES.SUCCESS;
    };

    removeMember(name) {
        if (!has_housemate(name)) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        const balance = this.store.get(name)
        if (hasDues(balance)) {
            return MOVE_OUT_MESSAGES.FAILURE;
        }

        const members_balances = this.store.get_balances()
        if (owedToSomeone(name, members_balances, balance)) {
            return MOVE_OUT_MESSAGES.FAILURE;
        }

        this.store.remove(name);
        return MOVE_OUT_MESSAGES.SUCCESS;
    }

    spend(amount, spent_by, ...on_members) {
        // How about a case when there are on_members
        if (this.store_meta.can_spend()) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        if (!has_housemate(spent_by)) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        if (!valid_members(on_members)) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }
        return this.finances.spend(amount, spent_by, ...on_members)
    }

    clearDue(borrower, lender, amount) {
        if (!has_housemate(borrower)) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;

        }
        if (!has_housemate(lender)) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        amount = parseInt(amount)
        return this.finances.processPayment(borrower, lender, amount);
    }

    dues(name) {
        if (!has_housemate(name)) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        const my_transactions = this.finances.transactions_by_member(name);

        const others_zero_dues_included = my_transactions.concat(this.getOtherMemberDues(my_transactions, name))

        const my_dues = sortDues(others_zero_dues_included)

        if (Array.isArray(my_dues) && my_dues.length > INITIAL_BALANCE) {
            return my_dues.map((element) => {
                return `${element.from} ${element.amount}`;
            });
        }
        return my_dues
    }

    getOtherMemberDues(housemate_dues, housemate) {
        const current_housemates = new Set(housemate_dues.map(h => h.from).concat(housemate))
        const all_housemates = new Set(this.store_meta.housemates())

        const diff = excluded_housemates(all_housemates, current_housemates)
        return Array.from(diff, (e) => ({ from: e, amount: INITIAL_BALANCE }))
    }
}

function sortDues(dues_list) {
    dues_list.sort((a, b) => {
        if (b.amount !== a.amount) {
            return b.amount - a.amount;
        }
        return a.from.localeCompare(b.from)
    })
    return dues_list
}

function excluded_housemates(setA, setB) {
    const difference = new Set();

    setA.forEach(item => {
        if (!setB.has(item)) {
            difference.add(item);
        }
    });

    return difference;
}


module.exports = Member