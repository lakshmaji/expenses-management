const { createResidence } = require("../test.helpers");
const { INITIAL_BALANCE, FILENAME_POSITION } = require("../src/constants");
const Store = require("../src/data/store");
const {
    addNHousemates,
    TESTING_CONSTANTS,
    nonMember,
} = require("../test.helpers");

describe("House Dues Management", () => {
    describe("SPEND", () => {
        let house;
        beforeEach(() => {
            new Store();
            house = createResidence();
        });

        afterEach(() => {
            Store.reset();
        });

        it("should spend when added spent amount on all housemates", () => {
            const members = addNHousemates(
                house,
                TESTING_CONSTANTS.MEMBER_COUNTS.SIX
            );
            const result = house.spend(TESTING_CONSTANTS.AMOUNTS.D, ...members);
            expect(result).toBe("SUCCESS");
        });

        it("should spend when added spent amount on few housemates", () => {
            const members = addNHousemates(
                house,
                TESTING_CONSTANTS.MEMBER_COUNTS.FOUR
            );
            const result = house.spend(
                TESTING_CONSTANTS.AMOUNTS.D,
                ...members.slice(INITIAL_BALANCE, FILENAME_POSITION)
            );
            expect(result).toBe("SUCCESS");
        });

        it("should not spend when added spent amount on a new member", () => {
            const members = addNHousemates(
                house,
                TESTING_CONSTANTS.MEMBER_COUNTS.TWO
            );
            const result = house.spend(
                TESTING_CONSTANTS.AMOUNTS.D,
                ...members,
                nonMember(members)
            );
            expect(result).toBe("MEMBER_NOT_FOUND");
        });

        it("should not spend when added spent amount by a non-member", () => {
            const members = addNHousemates(
                house,
                TESTING_CONSTANTS.MEMBER_COUNTS.THREE
            );
            const result = house.spend(
                TESTING_CONSTANTS.AMOUNTS.D,
                nonMember(members),
                ...members
            );
            expect(result).toBe("MEMBER_NOT_FOUND");
        });
    });
});
