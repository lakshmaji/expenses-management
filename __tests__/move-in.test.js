const { createResidence } = require("../test.helpers");
const Store = require("../src/data/store");
const {
    addNHousemates,
    TESTING_CONSTANTS,
    FAKE_NAMES,
} = require("../test.helpers");

describe("House Dues Management", () => {
    describe("MOVE_IN", () => {
        let house;
        beforeEach(() => {
            new Store();
            house = createResidence();
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
            addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.FIVE);
            const result = house.addMember(FAKE_NAMES.SUPER_RHINO);
            expect(result).toBe("HOUSEFUL");
        });
    });
});
