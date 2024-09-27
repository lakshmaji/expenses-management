const { createResidence } = require("../test.helpers");
const { INITIAL_BALANCE } = require("../src/constants");

const Store = require("../src/data/store");
const {
    FAKE_NAMES,
    TESTING_CONSTANTS,
    spendWithRoommates,
    addMembers,
} = require("../test.helpers");

describe("House Dues Management", () => {
    describe("DUES", () => {
        let house;
        beforeEach(() => {
            new Store();
            house = createResidence();
        });

        afterEach(() => {
            Store.reset();
        });

        // TODO: move or rename stringifyDues ?
        const prettyPrintDues = (dues) => {
            return dues.map((due) => `${due.from} ${due.amount}`);
        };

        it("should not print any dues when house is empty", () => {
            const result = house.dues(FAKE_NAMES.JACK);
            expect(result).toBe("MEMBER_NOT_FOUND");
        });

        it("should not print any dues when not a member of the house", () => {
            addMembers(house, [FAKE_NAMES.BILBY]);
            const result = house.dues(FAKE_NAMES.TURBO);
            expect(result).toBe("MEMBER_NOT_FOUND");
        });

        it("should not have any dues when there is no spent at all", () => {
            addMembers(house, [FAKE_NAMES.ANGRY_BIRD]);
            const result = house.dues(FAKE_NAMES.ANGRY_BIRD);
            expect(result).toEqual(prettyPrintDues([]));
        });

        it("should not have any dues when no one else have spent any amount", () => {
            addMembers(house, [FAKE_NAMES.PUPPY, FAKE_NAMES.TANGLED]);
            spendWithRoommates(house, [
                [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.PUPPY, FAKE_NAMES.TANGLED],
            ]);
            const result = house.dues(FAKE_NAMES.PUPPY);
            expect(result).toEqual(
                prettyPrintDues([{ amount: INITIAL_BALANCE, from: FAKE_NAMES.TANGLED }])
            );
        });

        it("should have some dues when some one else have spent amount", () => {
            addMembers(house, [FAKE_NAMES.PANDA, FAKE_NAMES.GRU]);
            spendWithRoommates(house, [
                [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.GRU, FAKE_NAMES.PANDA],
            ]);
            const result = house.dues(FAKE_NAMES.PANDA);
            expect(result).toEqual(
                prettyPrintDues([
                    {
                        amount: TESTING_CONSTANTS.AMOUNTS.A,
                        from: FAKE_NAMES.GRU,
                        to: FAKE_NAMES.PANDA,
                    },
                ])
            );
        });

        it("should have some dues when few others have spent amount", () => {
            addMembers(house, [FAKE_NAMES.WALL_E, FAKE_NAMES.GRU, FAKE_NAMES.T_REX]);
            spendWithRoommates(house, [
                [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.T_REX, FAKE_NAMES.WALL_E],
                [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.GRU, FAKE_NAMES.WALL_E],
            ]);

            const result = house.dues(FAKE_NAMES.WALL_E);

            expect(result).toEqual(
                prettyPrintDues([
                    {
                        amount: TESTING_CONSTANTS.AMOUNTS.A,
                        from: FAKE_NAMES.GRU,
                        to: FAKE_NAMES.WALL_E,
                    },
                    {
                        amount: TESTING_CONSTANTS.AMOUNTS.A,
                        from: FAKE_NAMES.T_REX,
                        to: FAKE_NAMES.WALL_E,
                    },
                ])
            );
        });

        it("should print dues by amount in descending order", () => {
            addMembers(house, [
                FAKE_NAMES.SNOWBALL,
                FAKE_NAMES.MINION,
                FAKE_NAMES.SUPER_RHINO,
            ]);
            spendWithRoommates(house, [
                [TESTING_CONSTANTS.AMOUNTS.L, FAKE_NAMES.MINION, FAKE_NAMES.SNOWBALL],
                [
                    TESTING_CONSTANTS.AMOUNTS.N,
                    FAKE_NAMES.SUPER_RHINO,
                    FAKE_NAMES.SNOWBALL,
                ],
            ]);

            const result = house.dues(FAKE_NAMES.SNOWBALL);
            expect(result).toEqual(
                prettyPrintDues([
                    {
                        amount: TESTING_CONSTANTS.AMOUNTS.M,
                        from: FAKE_NAMES.MINION,
                        to: FAKE_NAMES.SNOWBALL,
                    },
                    {
                        amount: TESTING_CONSTANTS.AMOUNTS.C,
                        from: FAKE_NAMES.SUPER_RHINO,
                        to: FAKE_NAMES.SNOWBALL,
                    },
                ])
            );
        });

        it("should print no dues when there are no dues", () => {
            addMembers(house, [
                FAKE_NAMES.FOR_THE_BIRDS,
                FAKE_NAMES.GRU,
                FAKE_NAMES.SUPER_RHINO,
            ]);
            spendWithRoommates(house, [
                [TESTING_CONSTANTS.AMOUNTS.B, FAKE_NAMES.GRU, FAKE_NAMES.FOR_THE_BIRDS],
            ]);

            const result = house.dues(FAKE_NAMES.SUPER_RHINO);

            expect(result).toEqual(
                prettyPrintDues([
                    {
                        amount: INITIAL_BALANCE,
                        from: FAKE_NAMES.FOR_THE_BIRDS,
                    },
                    {
                        amount: INITIAL_BALANCE,
                        from: FAKE_NAMES.GRU,
                    },
                ])
            );
        });

        it("should print dues by name in ascending order when amounts are equal", () => {
            addMembers(house, [
                FAKE_NAMES.DRU,
                FAKE_NAMES.WALL_E,
                FAKE_NAMES.SUPER_RHINO,
            ]);
            spendWithRoommates(house, [
                [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.DRU],
                [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.WALL_E, FAKE_NAMES.DRU],
            ]);
            const result = house.dues(FAKE_NAMES.DRU);
            expect(result).toEqual(
                prettyPrintDues([
                    {
                        amount: TESTING_CONSTANTS.AMOUNTS.A,
                        from: FAKE_NAMES.SUPER_RHINO,
                        to: FAKE_NAMES.DRU,
                    },
                    {
                        amount: TESTING_CONSTANTS.AMOUNTS.A,
                        from: FAKE_NAMES.WALL_E,
                        to: FAKE_NAMES.DRU,
                    },
                ])
            );
        });
    });
});
