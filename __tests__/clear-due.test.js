const helpers = require("../spec_helpers/common.utils");
const expenses = require("../spec_helpers/expenses.utils");
const { FAKE_NAMES } = require("../spec_helpers/constants");
const { INITIAL_BALANCE } = require("../src/constants");
const Store = require("../src/data/store");

describe("CLEAR_DUE", () => {
    let house;
    beforeEach(() => {
        house = helpers.createResidence();
    });

    afterEach(() => {
        Store.reset();
    });

    it("should not pay amount when there is spend at all in house", () => {
        helpers.addMembers(house, [FAKE_NAMES.T_REX, FAKE_NAMES.SNOWBALL]);
        const result = house.clearDue(
            FAKE_NAMES.T_REX,
            FAKE_NAMES.SNOWBALL,
            expenses.internet_bill
        );
        expect(result).toBe("INCORRECT_PAYMENT");
    });

    it("should not accept amount when borrower not a member of house", () => {
        helpers.addMembers(house, [FAKE_NAMES.SLOTH]);
        const result = house.clearDue(
            FAKE_NAMES.SLOTH,
            FAKE_NAMES.MINION,
            expenses.cable_bill
        );
        expect(result).toBe("MEMBER_NOT_FOUND");
    });

    it("should not accept amount when lender is not a member of house", () => {
        helpers.addMembers(house, [FAKE_NAMES.JACK]);
        const result = house.clearDue(
            FAKE_NAMES.PANDA,
            FAKE_NAMES.JACK,
            expenses.phone_bills
        );
        expect(result).toBe("MEMBER_NOT_FOUND");
    });

    it("should not accept amount when due is lower than the paying amount", () => {
        helpers.addMembers(house, [FAKE_NAMES.DRU, FAKE_NAMES.ANGRY_BIRD]);
        helpers.spendWithRoommates(house, [
            [expenses.cable_bill, FAKE_NAMES.ANGRY_BIRD, FAKE_NAMES.DRU],
        ]);
        const result = house.clearDue(
            FAKE_NAMES.DRU,
            FAKE_NAMES.ANGRY_BIRD,
            expenses.internet_bill
        );
        expect(result).toBe("INCORRECT_PAYMENT");
    });

    it("should not accept amount when he is the one who spent money", () => {
        helpers.addMembers(house, [FAKE_NAMES.WALL_E, FAKE_NAMES.TANGLED]);
        helpers.spendWithRoommates(house, [
            [expenses.cable_bill, FAKE_NAMES.TANGLED, FAKE_NAMES.WALL_E],
        ]);
        const result = house.clearDue(
            FAKE_NAMES.TANGLED,
            FAKE_NAMES.WALL_E,
            expenses.internet_bill
        );
        expect(result).toBe("INCORRECT_PAYMENT");
    });

    it("should accept amount when due is higher than paying amount", () => {
        helpers.addMembers(house, [FAKE_NAMES.TURBO, FAKE_NAMES.MINION]);
        helpers.spendWithRoommates(house, [
            [expenses.cable_bill, FAKE_NAMES.MINION, FAKE_NAMES.TURBO],
        ]);
        const result = house.clearDue(
            FAKE_NAMES.TURBO,
            FAKE_NAMES.MINION,
            expenses.essentials_cost
        );
        expect(result).toBe(expenses.library_bills);
    });

    it("should accept amount when due is equal paying amount", () => {
        helpers.addMembers(house, [FAKE_NAMES.GRU, FAKE_NAMES.JACK]);
        helpers.spendWithRoommates(house, [
            [expenses.cable_bill, FAKE_NAMES.JACK, FAKE_NAMES.GRU],
        ]);
        const result = house.clearDue(
            FAKE_NAMES.GRU,
            FAKE_NAMES.JACK,
            expenses.rent
        );
        expect(result).toBe(INITIAL_BALANCE);
    });
});
