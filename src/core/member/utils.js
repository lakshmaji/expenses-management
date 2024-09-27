function sortDues(dues_list) {
    dues_list.sort((a, b) => {
        if (b.amount !== a.amount) {
            return b.amount - a.amount;
        }
        return a.from.localeCompare(b.from)
    })
    return dues_list
}

function arrayDifference(a, b) {
    const setA = new Set(a)
    const setB = new Set(b)
    const difference = new Set();

    setA.forEach(item => {
        if (!setB.has(item)) {
            difference.add(item);
        }
    });

    return Array.from(difference);
}

module.exports = { sortDues, arrayDifference }