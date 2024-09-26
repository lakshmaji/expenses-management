const { INITIAL_BALANCE } = require("./constants");
const { HOUSEMATE_MESSAGES } = require("./messages");
const { settleDebts } = require("./transactions");

const dues = (store, housemate) => {
    const housemates = new Set(store.housemates().map(housemate => housemate.toLowerCase()));
    if (!housemates.has(housemate.toLowerCase())) {
        return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
    }

    const transactions = settleDebts(store);

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