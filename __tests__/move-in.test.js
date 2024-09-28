const helpers = require("../spec_helpers/common.utils");
const expenses = require("../spec_helpers/expenses.utils");
const { FAKE_NAMES } = require("../spec_helpers/constants");
const Store = require("../src/data/store");

describe("MOVE_IN", () => {
    let house;
    beforeEach(() => {
        house = helpers.createResidence();
    });

    afterEach(() => {
        Store.reset();
    });

    it("should welcome a new member to house when house is empty", () => {
        const result = house.addMember(FAKE_NAMES.T_REX);
        expect(result).toBe("SUCCESS");
    });

    it("should welcome a new member to house when house is not full", () => {
        house.addMember(FAKE_NAMES.SLOTH);
        const result = house.addMember(FAKE_NAMES.FOR_THE_BIRDS);
        expect(result).toBe("SUCCESS");
    });

    it("should not welcome a new member to house when houseful", () => {
        helpers.addNHousemates(house, expenses.RESIDENCE.CAPACITY.X_LARGE);
        const result = house.addMember(FAKE_NAMES.SUPER_RHINO);
        expect(result).toBe("HOUSEFUL");
    });
});
