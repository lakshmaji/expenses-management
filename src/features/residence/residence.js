const Finance = require('../../core/finance/finance');
const Member = require('../../core/member/member');
const ResidenceHelper = require('./residence.helper');

// Service. Lets say you want to manage expenses for something else 
// it will be another service file and might re-use the same core 
// features with adjustments
class Residence extends ResidenceHelper {
    constructor() {
        super()
        this.member = new Member()
        this.finances = new Finance()
    }

    addMember(name) {
        return this.member.addMember(name)    
    }

    moveOut(name) {
        return this.member.removeMember(name)    
    }

    spend(amount, spent_by, ...on_members) {
        return this.member.spend(amount, spent_by, ...on_members);
    }

    dues(name) {
        return this.member.dues(name)
    }

    clearDue(borrower, lender, amount) {
        return this.member.clearDue(borrower, lender, amount)
    }

    settleDebts() {
        return this.finances.transactions()
    }
}

module.exports = Residence