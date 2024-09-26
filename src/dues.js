const { INITIAL_BALANCE } = require("./constants");
const { HOUSEMATE_MESSAGES } = require("./messages");
const Store = require("./store");
const { settleDebts } = require("./transactions");
const { has_housemate } = require("./validations");

const dues = (housemate) => {
    if (!has_housemate(housemate)) {
        return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
    }

    const transactions = settleDebts();

    const housemate_dues = transactions.filter(t => t.to === housemate)

    result = housemate_dues.concat(getOtherMemberDues(housemate_dues, housemate))

    return sortDues(result)
}

function getOtherMemberDues(housemate_dues, housemate) {
    const store = new Store()
    
    const current_housemates = new Set(housemate_dues.map(h => h.from).concat(housemate))
    const all_housemates = new Set(store.housemates())

    const diff = excluded_housemates(all_housemates, current_housemates)
    return Array.from(diff, (e) => ({ from: e, amount: INITIAL_BALANCE }))
}

function sortDues(dues_list)  {
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


module.exports = { dues }