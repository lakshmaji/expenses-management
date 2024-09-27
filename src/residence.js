const { addMember } = require('./add-member');
const { clearDue } = require('./clear-due');
const { dues } = require('./dues');
const Finance = require('./finance');
const Member = require('./member');
const { moveOut } = require('./move-out');
const { spend } = require('./spend');
const Store = require('./store');
const StoreMeta = require('./store_meta');
const { settleDebts } = require('./transactions');

const housemates = () => {
    const store_meta = new StoreMeta()
    return store_meta.housemates()
}
const house_full = () => {
    const store_meta = new StoreMeta()
    return store_meta.is_full()
}
const occupants_count = () => {
    const store = new StoreMeta()
    return store.housemate_count()
}

const getBalances = () => {
    const store = new Store()
    return Object.fromEntries(store.get_balances())
}

class SomeHelper {
    constructor() {
        this.store=new Store()
        this.store_meta = new StoreMeta()
    }
    housemates  ()  {
        return this.store_meta.housemates()
    }
    house_full ()  {
        return this.store_meta.is_full()
    }
    occupants_count () {
        return this.store_meta.housemate_count()
    }
    
    getBalances () {
        return Object.fromEntries(this.store.get_balances())
    }
}

class Residence extends SomeHelper {
    constructor() {
        super()
        this.finances = new Finance()
    }

    addMember(name) {
        const member = new Member();
        return member.addMember(name)    
    }

    moveOut(name) {
        const member = new Member();
        return member.removeMember(name)    
    }

    spend(amount, spent_by, ...on_members) {
        const member = new Member();
        return member.spend(amount, spent_by, ...on_members);
    }

    dues(name) {
        const member = new Member()
        return member.dues(name)
    }

    clearDue(borrower, lender, amount) {
        const member = new Member()
        return member.clearDue(borrower, lender, amount)
    }
    

    settleDebts() {
        return this.finances.transactions()
    }
}

// const createResidence = () => {
//     return {
//         addMember,
//         clearDue,
//         dues,
//         moveOut,
//         spend,
//         settleDebts,
//         getBalances,
//         housemates,
//         house_full,
//         occupants_count,
//     };
// };

const createResidence = () => {
    const abc = new Residence()
    return abc;
};

module.exports = { createResidence, Residence }