const helpers = require("../spec_helpers/common.utils");
const expenses = require("../spec_helpers/expenses.utils");
const { FAKE_NAMES } = require("../spec_helpers/constants");
const {
    INITIAL_BALANCE,
    FILENAME_POSITION,
    MAXIMUM_OCCUPANCY,
} = require("../src/constants");
const Store = require("../src/data/store");

describe("properties", () => {
    let house;

    beforeEach(() => {
        house = helpers.createResidence();
    });

    afterEach(() => {
        Store.reset();
    });

    describe("occupants_count", () => {
        it("should have no residents", () => {
            expect(house.occupants_count()).toBe(INITIAL_BALANCE);
        });

        it("should have two housemates", () => {
            helpers.addMembers(house, [FAKE_NAMES.PUPPY, FAKE_NAMES.JACK]);
            expect(house.occupants_count()).toBe(FILENAME_POSITION);
        });

        it("should have three housemates", () => {
            helpers.addNHousemates(house, expenses.RESIDENCE.CAPACITY.LARGE);
            expect(house.occupants_count()).toBe(MAXIMUM_OCCUPANCY);
        });
    });

    describe("house_full", () => {
        it("should return false when house is empty", () => {
            expect(house.house_full()).toBe(false);
        });

        it("should return false when there are few housemates", () => {
            helpers.addMembers(house, [FAKE_NAMES.FOR_THE_BIRDS, FAKE_NAMES.PUPPY]);
            expect(house.house_full()).toBe(false);
        });

        it("should return true when house is full", () => {
            helpers.addNHousemates(house, expenses.RESIDENCE.CAPACITY.MEDIUM);
            expect(house.house_full()).toBe(true);
        });
    });

    describe("housemates", () => {
        it("should empty array when house is empty", () => {
            expect(house.housemates()).toEqual([]);
        });

        it("should return housemates list when there are few housemates", () => {
            const members = helpers.addNHousemates(
                house,
                expenses.RESIDENCE.CAPACITY.SMALL
            );
            expect(house.housemates()).toEqual(members);
        });

        it("should return housemates list house is full", () => {
            const members = helpers.addNHousemates(
                house,
                expenses.RESIDENCE.CAPACITY.X_SMALL
            );
            expect(house.housemates()).toEqual(members);
        });
    });

    describe("getBalances", () => {
        it("should return empty balances when house is empty", () => {
            expect(house.getBalances()).toEqual({});
        });

        it("should return zero balances when house has no spending amount at all", () => {
            helpers.addMembers(house, [FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.PIPER]);
            expect(house.getBalances()).toEqual({
                [FAKE_NAMES.SUPER_RHINO]: INITIAL_BALANCE,
                [FAKE_NAMES.PIPER]: INITIAL_BALANCE,
            });
        });

        it("should return balances when house at least some has spent some amount", () => {
            helpers.addMembers(house, [FAKE_NAMES.TURBO, FAKE_NAMES.SNOWBALL]);
            helpers.spendWithRoommates(house, [
                [expenses.cable_bill, FAKE_NAMES.TURBO, FAKE_NAMES.SNOWBALL],
            ]);
            expect(house.getBalances()).toEqual({
                [FAKE_NAMES.TURBO]: -expenses.rent,
                [FAKE_NAMES.SNOWBALL]: expenses.rent,
            });
        });

        it("should return net balances when house at all members have spent some amount", () => {
            helpers.addMembers(house, [
                FAKE_NAMES.SNOWBALL,
                FAKE_NAMES.ANGRY_BIRD,
                FAKE_NAMES.WALL_E,
            ]);
            helpers.spendWithRoommates(house, [
                [
                    expenses.parties_bill,
                    FAKE_NAMES.ANGRY_BIRD,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.WALL_E,
                ],
                [
                    expenses.cable_bill,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.ANGRY_BIRD,
                ],
                [
                    expenses.movies_bill,
                    FAKE_NAMES.WALL_E,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.ANGRY_BIRD,
                ],
            ]);
            expect(house.getBalances()).toEqual({
                [FAKE_NAMES.ANGRY_BIRD]: expenses.rent,
                [FAKE_NAMES.SNOWBALL]: expenses.fuel_bills,
                [FAKE_NAMES.WALL_E]: -expenses.parties_bill,
            });
        });

        it("should be zero when sum the balances ", () => {
            helpers.addMembers(house, [
                FAKE_NAMES.BILBY,
                FAKE_NAMES.SUPER_RHINO,
                FAKE_NAMES.WALL_E,
            ]);
            helpers.spendWithRoommates(house, [
                [
                    expenses.parties_bill,
                    FAKE_NAMES.SUPER_RHINO,
                    FAKE_NAMES.BILBY,
                    FAKE_NAMES.WALL_E,
                ],
                [expenses.cable_bill, FAKE_NAMES.BILBY, FAKE_NAMES.SUPER_RHINO],
                [
                    expenses.movies_bill,
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
            helpers.addMembers(house, [
                FAKE_NAMES.FOR_THE_BIRDS,
                FAKE_NAMES.SUPER_RHINO,
                FAKE_NAMES.WALL_E,
            ]);
            helpers.spendWithRoommates(house, [
                [
                    expenses.parties_bill,
                    FAKE_NAMES.SUPER_RHINO,
                    FAKE_NAMES.FOR_THE_BIRDS,
                    FAKE_NAMES.WALL_E,
                ],
                [
                    expenses.parties_bill,
                    FAKE_NAMES.FOR_THE_BIRDS,
                    FAKE_NAMES.WALL_E,
                ],
            ]);
            const previous_balances = house.getBalances();
            house.clearDue(
                FAKE_NAMES.WALL_E,
                FAKE_NAMES.FOR_THE_BIRDS,
                expenses.essentials_cost
            );
            expect(house.getBalances()).toHaveChanged(previous_balances, {
                [FAKE_NAMES.FOR_THE_BIRDS]: INITIAL_BALANCE,
                [FAKE_NAMES.WALL_E]: expenses.laundry_bill,
            });
        });
    });

    describe("settleDebts", () => {
        it("should return empty transactions when house is empty", () => {
            expect(house.settleDebts()).toEqual([]);
        });

        it("should return empty transactions when house has no spending amount at all", () => {
            helpers.addMembers(house, [FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SONIC]);
            expect(house.settleDebts()).toEqual([]);
        });

        it("should return transactions when house at least some has spent some amount", () => {
            helpers.addMembers(house, [FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL]);
            helpers.spendWithRoommates(house, [
                [
                    expenses.cable_bill,
                    FAKE_NAMES.SUPER_RHINO,
                    FAKE_NAMES.SNOWBALL,
                ],
            ]);
            expect(house.settleDebts()).toEqual([
                {
                    amount: expenses.rent,
                    from: FAKE_NAMES.SUPER_RHINO,
                    to: FAKE_NAMES.SNOWBALL,
                },
            ]);
        });

        it("should return all transactions when all members have spent some amount", () => {
            helpers.addMembers(house, [
                FAKE_NAMES.SNOWBALL,
                FAKE_NAMES.SUPER_RHINO,
                FAKE_NAMES.WALL_E,
            ]);
            helpers.spendWithRoommates(house, [
                [
                    expenses.parties_bill,
                    FAKE_NAMES.SUPER_RHINO,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.WALL_E,
                ],
                [
                    expenses.cable_bill,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.SUPER_RHINO,
                ],
                [
                    expenses.movies_bill,
                    FAKE_NAMES.WALL_E,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.SUPER_RHINO,
                ],
            ]);
            expect(house.settleDebts()).toEqual([
                {
                    from: FAKE_NAMES.WALL_E,
                    to: FAKE_NAMES.SNOWBALL,
                    amount: expenses.fuel_bills,
                },
                {
                    from: FAKE_NAMES.WALL_E,
                    to: FAKE_NAMES.SUPER_RHINO,
                    amount: expenses.rent,
                },
            ]);
        });

        it("should have the same as sum of net balances, when sum the all transactions ", () => {
            helpers.addMembers(house, [
                FAKE_NAMES.SNOWBALL,
                FAKE_NAMES.TURBO,
                FAKE_NAMES.WALL_E,
            ]);
            helpers.spendWithRoommates(house, [
                [
                    expenses.parties_bill,
                    FAKE_NAMES.TURBO,
                    FAKE_NAMES.SNOWBALL,
                    FAKE_NAMES.WALL_E,
                ],
                [expenses.cable_bill, FAKE_NAMES.SNOWBALL, FAKE_NAMES.TURBO],
                [
                    expenses.movies_bill,
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
            helpers.addMembers(house, [
                FAKE_NAMES.MINION,
                FAKE_NAMES.SUPER_RHINO,
                FAKE_NAMES.WALL_E,
            ]);
            helpers.spendWithRoommates(house, [
                [
                    expenses.parties_bill,
                    FAKE_NAMES.SUPER_RHINO,
                    FAKE_NAMES.MINION,
                    FAKE_NAMES.WALL_E,
                ],
                [expenses.parties_bill, FAKE_NAMES.MINION, FAKE_NAMES.WALL_E],
            ]);
            expect(house.settleDebts()).toEqual([
                {
                    amount: expenses.essentials_cost,
                    from: FAKE_NAMES.MINION,
                    to: FAKE_NAMES.WALL_E,
                },
                {
                    amount: expenses.laundry_bill,
                    from: FAKE_NAMES.SUPER_RHINO,
                    to: FAKE_NAMES.WALL_E,
                },
            ]);
            house.clearDue(
                FAKE_NAMES.WALL_E,
                FAKE_NAMES.MINION,
                expenses.essentials_cost
            );
            expect(house.settleDebts()).toEqual([
                {
                    from: FAKE_NAMES.SUPER_RHINO,
                    to: FAKE_NAMES.WALL_E,
                    amount: expenses.laundry_bill,
                },
            ]);
        });
    });
});
