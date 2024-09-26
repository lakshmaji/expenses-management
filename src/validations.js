const Store = require("./store");

const has_housemate = (member) => {
    const store = new Store()
    const housemates = new Set(store.housemates().map(housemate => housemate.toLowerCase()));
    return housemates.has(member.toLowerCase())
}

const valid_members = members => {
    const store = new Store()
    const housemates = new Set(store.housemates().map(housemate => housemate.toLowerCase()));
    return members.every(member => housemates.has(member.toLowerCase()))
}

module.exports = {has_housemate, valid_members}