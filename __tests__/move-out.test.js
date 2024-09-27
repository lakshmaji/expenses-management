const { createResidence } = require("../test.helpers");
const Store = require("../src/data/store");
const {
    addNHousemates,
    TESTING_CONSTANTS,
    getOneHousemate,
    nonMember,
    FAKE_NAMES,
    addMembers,
    spendWithRoommates,
    clearMemberDues,
} = require("../test.helpers");

describe("House Dues Management", () => {
    describe("MOVE_OUT", () => {
        let house;
        beforeEach(() => {
            new Store();
            house = createResidence();
        });

        afterEach(() => {
            Store.reset();
        });

        it("should move out a member they do not have any spending by any members in the house", () => {
            const members = addNHousemates(
                house,
                TESTING_CONSTANTS.MEMBER_COUNTS.THREE
            );
            const result = house.moveOut(getOneHousemate(members));
            expect(result).toBe("SUCCESS");
        });

        it("should not move out when trying to move a non member of the house", () => {
            const members = addNHousemates(
                house,
                TESTING_CONSTANTS.MEMBER_COUNTS.TWO
            );
            const result = house.moveOut(nonMember(members));
            expect(result).toBe("MEMBER_NOT_FOUND");
        });

        it("should not move out when trying to move a member with due", () => {
            addMembers(house, [FAKE_NAMES.PANDA, FAKE_NAMES.JACK]);
            spendWithRoommates(house, [
                [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.JACK, FAKE_NAMES.PANDA],
            ]);
            const result = house.moveOut(FAKE_NAMES.PANDA);
            expect(result).toBe("FAILURE");
        });

        it("should not move out when member owed by others", () => {
            addMembers(house, [FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL]);
            spendWithRoommates(house, [
                [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU],
            ]);
            const result = house.moveOut(FAKE_NAMES.SNOWBALL);
            expect(result).toBe("FAILURE");
        });

        it("should not move out when member do not have dues", () => {
            addMembers(house, [
                FAKE_NAMES.TURBO,
                FAKE_NAMES.SNOWBALL,
                FAKE_NAMES.SUPER_RHINO,
            ]);
            spendWithRoommates(house, [
                [
                    TESTING_CONSTANTS.AMOUNTS.D,
                    FAKE_NAMES.TURBO,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.SUPER_RHINO,
                ],
                [
                    TESTING_CONSTANTS.AMOUNTS.O,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.SUPER_RHINO,
                ],
            ]);
            clearMemberDues(house, [
                [FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.TURBO, TESTING_CONSTANTS.AMOUNTS.K],
                [FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.TURBO, TESTING_CONSTANTS.AMOUNTS.I],
                [FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.TURBO, TESTING_CONSTANTS.AMOUNTS.J],
            ]);
            const result = house.moveOut(FAKE_NAMES.SUPER_RHINO);
            expect(result).toBe("SUCCESS");
        });

        it("should move out a individual who doesnt owed to anyone and no dues", () => {
            addMembers(house, [
                FAKE_NAMES.FOR_THE_BIRDS,
                FAKE_NAMES.SNOWBALL,
                FAKE_NAMES.PIPER,
            ]);
            spendWithRoommates(house, [
                [
                    TESTING_CONSTANTS.AMOUNTS.D,
                    FAKE_NAMES.FOR_THE_BIRDS,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.PIPER,
                ],
                [
                    TESTING_CONSTANTS.AMOUNTS.D,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.PIPER,
                    FAKE_NAMES.FOR_THE_BIRDS,
                ],
                [TESTING_CONSTANTS.AMOUNTS.B, FAKE_NAMES.PIPER, FAKE_NAMES.SNOWBALL],
            ]);
            expect(house.moveOut(FAKE_NAMES.FOR_THE_BIRDS)).toEqual("FAILURE");
            expect(house.moveOut(FAKE_NAMES.PIPER)).toEqual("FAILURE");
            expect(house.moveOut(FAKE_NAMES.SNOWBALL)).toEqual("SUCCESS");
        });
    });
});
