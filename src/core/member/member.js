const { INITIAL_BALANCE } = require("../../constants");
const Finance = require("../finance/finance");
const { HOUSEMATE_MESSAGES, MOVE_OUT_MESSAGES } = require("../../messages");
const Store = require("../../data/store");
const StoreMeta = require("../store_meta");
const { has_housemate } = require("./validators/validations");
const AddMemberValidator = require("./validators/add-member-validator");
const RemoveMemberValidator = require("./validators/remove-member-validator");
const MemberSpendValidator = require("./validators/member-spend-validator");
const MemberClearDueValidator = require("./validators/member-clear-due-validator");
const transformDues = require("./transformers/dues-transformer");
const { sortDues, arrayDifference } = require("./utils");

class Member {
    constructor() {
        this.store = new Store();
        this.store_meta = new StoreMeta();
        this.finances = new Finance();
        this.add_member_validator = new AddMemberValidator();
        this.remove_member_validator = new RemoveMemberValidator();
        this.member_spend_validator = new MemberSpendValidator();
        this.member_clear_due_validator = new MemberClearDueValidator();
    }

    addMember(name) {
        const error = this.add_member_validator.validate();
        if (error) {
            return error;
        }
        this.store.add(name);
        return HOUSEMATE_MESSAGES.SUCCESS;
    }

    removeMember(name) {
        const error = this.remove_member_validator.validate(name);
        if (error) {
            return error;
        }

        this.store.remove(name);
        return MOVE_OUT_MESSAGES.SUCCESS;
    }

    spend(amount, spent_by, ...on_members) {
        const error = this.member_spend_validator.validate(spent_by, on_members);
        if (error) {
            return error;
        }
        return this.finances.spend(amount, spent_by, ...on_members);
    }

    clearDue(borrower, lender, amount) {
        const error = this.member_clear_due_validator.validate(borrower, lender);
        if (error) {
            return error;
        }

        return this.finances.processPayment(borrower, lender, parseInt(amount));
    }

    dues(name) {
        if (!has_housemate(name)) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        const my_transactions = this.finances.transactionsByMember(name);
        const dues = this.appendEmptyDues(my_transactions, name);
        return transformDues(sortDues(dues));
    }

    appendEmptyDues(housemate_dues, housemate) {
        const current_housemates = housemate_dues
            .map((h) => h.from)
            .concat(housemate);
        const all_housemates = this.store_meta.housemates();

        const diff = arrayDifference(all_housemates, current_housemates);
        return housemate_dues.concat(
            diff.map((e) => ({ from: e, amount: INITIAL_BALANCE }))
        );
    }
}

module.exports = Member;
