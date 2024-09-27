const { createResidence } = require("../test.helpers");
const {
    INITIAL_BALANCE,
    FILENAME_POSITION,
    MAXIMUM_OCCUPANCY,
} = require("../src/constants");
const Store = require("../src/data/store");
const {
    FAKE_NAMES,
    addNHousemates,
    TESTING_CONSTANTS,
    addMembers,
    spendWithRoommates,
} = require("../test.helpers");

describe("properties", () => {
    let house;

    beforeEach(() => {
        new Store();
        house = createResidence();
    });

    afterEach(() => {
        Store.reset();
    });

    describe("occupants_count", () => {
        it("should have no residents", () => {
            expect(house.occupants_count()).toBe(INITIAL_BALANCE);
        });

        it("should have two housemates", () => {
            addMembers(house, [FAKE_NAMES.PUPPY, FAKE_NAMES.JACK]);
            expect(house.occupants_count()).toBe(FILENAME_POSITION);
        });

        it("should have three housemates", () => {
            addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.FOUR);
            expect(house.occupants_count()).toBe(MAXIMUM_OCCUPANCY);
        });
    });

    describe("house_full", () => {
        it("should return false when house is empty", () => {
            expect(house.house_full()).toBe(false);
        });

        it("should return false when there are few housemates", () => {
            addMembers(house, [FAKE_NAMES.FOR_THE_BIRDS, FAKE_NAMES.PUPPY]);
            expect(house.house_full()).toBe(false);
        });

        it("should return true when house is full", () => {
            addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.THREE);
            expect(house.house_full()).toBe(true);
        });
    });

    describe("housemates", () => {
        it("should empty array when house is empty", () => {
            expect(house.housemates()).toEqual([]);
        });

        it("should return housemates list when there are few housemates", () => {
            const members = addNHousemates(
                house,
                TESTING_CONSTANTS.MEMBER_COUNTS.TWO
            );
            expect(house.housemates()).toEqual(members);
        });

        it("should return housemates list house is full", () => {
            const members = addNHousemates(
                house,
                TESTING_CONSTANTS.MEMBER_COUNTS.SIX
            );
            expect(house.housemates()).toEqual(members);
        });
    });

    describe("getBalances", () => {
        it("should return empty balances when house is empty", () => {
            expect(house.getBalances()).toEqual({});
        });

        it("should return zero balances when house has no spending amount at all", () => {
            addMembers(house, [FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.PIPER]);
            expect(house.getBalances()).toEqual({
                [FAKE_NAMES.SUPER_RHINO]: INITIAL_BALANCE,
                [FAKE_NAMES.PIPER]: INITIAL_BALANCE,
            });
        });

        it("should return balances when house at least some has spent some amount", () => {
            addMembers(house, [FAKE_NAMES.TURBO, FAKE_NAMES.SNOWBALL]);
            spendWithRoommates(house, [
                [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.TURBO, FAKE_NAMES.SNOWBALL],
            ]);
            expect(house.getBalances()).toEqual({
                [FAKE_NAMES.TURBO]: -TESTING_CONSTANTS.AMOUNTS.A,
                [FAKE_NAMES.SNOWBALL]: TESTING_CONSTANTS.AMOUNTS.A,
            });
        });

        it("should return net balances when house at all members have spent some amount", () => {
            addMembers(house, [
                FAKE_NAMES.SNOWBALL,
                FAKE_NAMES.ANGRY_BIRD,
                FAKE_NAMES.WALL_E,
            ]);
            spendWithRoommates(house, [
                [
                    TESTING_CONSTANTS.AMOUNTS.F,
                    FAKE_NAMES.ANGRY_BIRD,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.WALL_E,
                ],
                [
                    TESTING_CONSTANTS.AMOUNTS.D,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.ANGRY_BIRD,
                ],
                [
                    TESTING_CONSTANTS.AMOUNTS.G,
                    FAKE_NAMES.WALL_E,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.ANGRY_BIRD,
                ],
            ]);
            expect(house.getBalances()).toEqual({
                [FAKE_NAMES.ANGRY_BIRD]: TESTING_CONSTANTS.AMOUNTS.A,
                [FAKE_NAMES.SNOWBALL]: TESTING_CONSTANTS.AMOUNTS.E,
                [FAKE_NAMES.WALL_E]: -TESTING_CONSTANTS.AMOUNTS.F,
            });
        });

        it("should be zero when sum the balances ", () => {
            addMembers(house, [
                FAKE_NAMES.BILBY,
                FAKE_NAMES.SUPER_RHINO,
                FAKE_NAMES.WALL_E,
            ]);
            spendWithRoommates(house, [
                [
                    TESTING_CONSTANTS.AMOUNTS.F,
                    FAKE_NAMES.SUPER_RHINO,
                    FAKE_NAMES.BILBY,
                    FAKE_NAMES.WALL_E,
                ],
                [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.BILBY, FAKE_NAMES.SUPER_RHINO],
                [
                    TESTING_CONSTANTS.AMOUNTS.G,
                    FAKE_NAMES.WALL_E,
                    FAKE_NAMES.BILBY,
                    FAKE_NAMES.SUPER_RHINO,
                ],
            ]);
            const balances = house.getBalances();
            const total = Object.values(balances).reduce(
                (total, balance) => total + balance,
                INITIAL_BALANCE
            );
            expect(total).toEqual(INITIAL_BALANCE);
        });

        it("should change balance when some dues are cleared", () => {
            addMembers(house, [
                FAKE_NAMES.FOR_THE_BIRDS,
                FAKE_NAMES.SUPER_RHINO,
                FAKE_NAMES.WALL_E,
            ]);
            spendWithRoommates(house, [
                [
                    TESTING_CONSTANTS.AMOUNTS.F,
                    FAKE_NAMES.SUPER_RHINO,
                    FAKE_NAMES.FOR_THE_BIRDS,
                    FAKE_NAMES.WALL_E,
                ],
                [
                    TESTING_CONSTANTS.AMOUNTS.F,
                    FAKE_NAMES.FOR_THE_BIRDS,
                    FAKE_NAMES.WALL_E,
                ],
            ]);
            const previous_balances = house.getBalances();
            house.clearDue(
                FAKE_NAMES.WALL_E,
                FAKE_NAMES.FOR_THE_BIRDS,
                TESTING_CONSTANTS.AMOUNTS.H
            );
            expect(house.getBalances()).toHaveChanged(previous_balances, {
                [FAKE_NAMES.FOR_THE_BIRDS]: INITIAL_BALANCE,
                [FAKE_NAMES.WALL_E]: TESTING_CONSTANTS.AMOUNTS.C,
            });
        });
    });

    describe("settleDebts", () => {
        it("should return empty transactions when house is empty", () => {
            expect(house.settleDebts()).toEqual([]);
        });

        it("should return empty transactions when house has no spending amount at all", () => {
            addMembers(house, [FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SONIC]);
            expect(house.settleDebts()).toEqual([]);
        });

        it("should return transactions when house at least some has spent some amount", () => {
            addMembers(house, [FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL]);
            spendWithRoommates(house, [
                [
                    TESTING_CONSTANTS.AMOUNTS.D,
                    FAKE_NAMES.SUPER_RHINO,
                    FAKE_NAMES.SNOWBALL,
                ],
            ]);
            expect(house.settleDebts()).toEqual([
                {
                    amount: TESTING_CONSTANTS.AMOUNTS.A,
                    from: FAKE_NAMES.SUPER_RHINO,
                    to: FAKE_NAMES.SNOWBALL,
                },
            ]);
        });

        it("should return all transactions when all members have spent some amount", () => {
            addMembers(house, [
                FAKE_NAMES.SNOWBALL,
                FAKE_NAMES.SUPER_RHINO,
                FAKE_NAMES.WALL_E,
            ]);
            spendWithRoommates(house, [
                [
                    TESTING_CONSTANTS.AMOUNTS.F,
                    FAKE_NAMES.SUPER_RHINO,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.WALL_E,
                ],
                [
                    TESTING_CONSTANTS.AMOUNTS.D,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.SUPER_RHINO,
                ],
                [
                    TESTING_CONSTANTS.AMOUNTS.G,
                    FAKE_NAMES.WALL_E,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.SUPER_RHINO,
                ],
            ]);
            expect(house.settleDebts()).toEqual([
                {
                    from: FAKE_NAMES.WALL_E,
                    to: FAKE_NAMES.SNOWBALL,
                    amount: TESTING_CONSTANTS.AMOUNTS.E,
                },
                {
                    from: FAKE_NAMES.WALL_E,
                    to: FAKE_NAMES.SUPER_RHINO,
                    amount: TESTING_CONSTANTS.AMOUNTS.A,
                },
            ]);
        });

        it("should have the same as sum of net balances, when sum the all transactions ", () => {
            addMembers(house, [
                FAKE_NAMES.SNOWBALL,
                FAKE_NAMES.TURBO,
                FAKE_NAMES.WALL_E,
            ]);
            spendWithRoommates(house, [
                [
                    TESTING_CONSTANTS.AMOUNTS.F,
                    FAKE_NAMES.TURBO,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.WALL_E,
                ],
                [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.TURBO],
                [
                    TESTING_CONSTANTS.AMOUNTS.G,
                    FAKE_NAMES.WALL_E,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.TURBO,
                ],
            ]);
            const balances = house.getBalances();
            const expected_total = Object.values(balances).reduce(
                (total, balance) =>
                    balance > INITIAL_BALANCE ? total + balance : total,
                INITIAL_BALANCE
            );
            const transactions = house.settleDebts();

            const actual_total = transactions.reduce(
                (sum, transaction) => sum + transaction.amount,
                INITIAL_BALANCE
            );
            expect(expected_total).toEqual(actual_total);
        });

        it("should change balance when some dues are cleared", () => {
            addMembers(house, [
                FAKE_NAMES.MINION,
                FAKE_NAMES.SUPER_RHINO,
                FAKE_NAMES.WALL_E,
            ]);
            spendWithRoommates(house, [
                [
                    TESTING_CONSTANTS.AMOUNTS.F,
                    FAKE_NAMES.SUPER_RHINO,
                    FAKE_NAMES.MINION,
                    FAKE_NAMES.WALL_E,
                ],
                [TESTING_CONSTANTS.AMOUNTS.F, FAKE_NAMES.MINION, FAKE_NAMES.WALL_E],
            ]);
            expect(house.settleDebts()).toEqual([
                {
                    amount: TESTING_CONSTANTS.AMOUNTS.H,
                    from: FAKE_NAMES.MINION,
                    to: FAKE_NAMES.WALL_E,
                },
                {
                    amount: TESTING_CONSTANTS.AMOUNTS.C,
                    from: FAKE_NAMES.SUPER_RHINO,
                    to: FAKE_NAMES.WALL_E,
                },
            ]);
            house.clearDue(
                FAKE_NAMES.WALL_E,
                FAKE_NAMES.MINION,
                TESTING_CONSTANTS.AMOUNTS.H
            );
            expect(house.settleDebts()).toEqual([
                {
                    from: FAKE_NAMES.SUPER_RHINO,
                    to: FAKE_NAMES.WALL_E,
                    amount: TESTING_CONSTANTS.AMOUNTS.C,
                },
            ]);
        });
    });
});
