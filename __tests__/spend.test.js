const helpers = require("../spec_helpers/common.utils");
const expenses = require("../spec_helpers/expenses.utils");
const { INITIAL_BALANCE, FILENAME_POSITION } = require("../src/constants");
const Store = require("../src/data/store");

describe("SPEND", () => {
    let house;
    beforeEach(() => {
        house = helpers.createResidence();
    });

    afterEach(() => {
        Store.reset();
    });

    it("should spend when added spent amount on all housemates", () => {
        const members = helpers.addNHousemates(
            house,
            expenses.RESIDENCE.CAPACITY.X_SMALL
        );
        const result = house.spend(expenses.cable_bill, ...members);
        expect(result).toBe("SUCCESS");
    });

    it("should spend when added spent amount on few housemates", () => {
        const members = helpers.addNHousemates(
            house,
            expenses.RESIDENCE.CAPACITY.LARGE
        );
        const result = house.spend(
            expenses.cable_bill,
            ...members.slice(INITIAL_BALANCE, FILENAME_POSITION)
        );
        expect(result).toBe("SUCCESS");
    });

    it("should not spend when added spent amount on a new member", () => {
        const members = helpers.addNHousemates(
            house,
            expenses.RESIDENCE.CAPACITY.SMALL
        );
        const result = house.spend(
            expenses.cable_bill,
            ...members,
            helpers.nonMember(members)
        );
        expect(result).toBe("MEMBER_NOT_FOUND");
    });

    it("should not spend when added spent amount by a non-member", () => {
        const members = helpers.addNHousemates(
            house,
            expenses.RESIDENCE.CAPACITY.MEDIUM
        );
        const result = house.spend(
            expenses.cable_bill,
            helpers.nonMember(members),
            ...members
        );
        expect(result).toBe("MEMBER_NOT_FOUND");
    });
});
