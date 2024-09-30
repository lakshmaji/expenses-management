const helpers = require("../spec_helpers/common.utils");
const expenses = require("../spec_helpers/expenses.utils");
const { FAKE_NAMES } = require("../spec_helpers/constants");
const {
    INITIAL_BALANCE,
    FILENAME_POSITION,
    MAXIMUM_OCCUPANCY,
} = require("../src/constants");
const Store = require("../src/data/store");
const { sum } = require("../src/core/finance/utils");

const allHaveSpent = (house) => {
    helpers.addMembersAndSpend(
        house,
        [FAKE_NAMES.SNOWBALL, FAKE_NAMES.BILBY, FAKE_NAMES.WALL_E],
        [
            [
                expenses.parties_bill,
                FAKE_NAMES.BILBY,
                FAKE_NAMES.SNOWBALL,
                FAKE_NAMES.WALL_E,
            ],
            [expenses.cable_bill, FAKE_NAMES.SNOWBALL, FAKE_NAMES.BILBY],
            [
                expenses.movies_bill,
                FAKE_NAMES.WALL_E,
                FAKE_NAMES.SNOWBALL,
                FAKE_NAMES.BILBY,
            ],
        ]
    );
    return Object.fromEntries(new Store().balances);
};

const changeBalanceEvents = (house) => {
    return {
        initial: () => {
            helpers.addMembersAndSpend(
                house,
                [
                    FAKE_NAMES.MINION,
                    FAKE_NAMES.BILBY,
                    FAKE_NAMES.WALL_E,
                    FAKE_NAMES.PANDA,
                ],
                [
                    [
                        expenses.parties_bill,
                        FAKE_NAMES.BILBY,
                        FAKE_NAMES.MINION,
                        FAKE_NAMES.WALL_E,
                    ],
                    [expenses.parties_bill, FAKE_NAMES.MINION, FAKE_NAMES.WALL_E],
                ]
            );
        },
        final: () => {
            house.clearDue(
                FAKE_NAMES.WALL_E,
                FAKE_NAMES.MINION,
                expenses.essentials_cost
            );
        },
    };
};

describe("properties", () => {
    let house;

    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation();
        house = helpers.createResidence();
    });

    afterEach(() => {
        Store.reset();
        jest.spyOn(console, "log").mockRestore();
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

    describe("settleDebts", () => {
        it("should return empty transactions when house is empty", () => {
            expect(house.settleDebts()).toEqual([]);
        });

        it("should return empty transactions when house has no spending amount at all", () => {
            helpers.addMembers(house, [FAKE_NAMES.BILBY, FAKE_NAMES.SONIC]);
            expect(house.settleDebts()).toEqual([]);
        });

        it("should return transactions when house at least some has spent some amount", () => {
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.SLOTH, FAKE_NAMES.SNOWBALL],
                [[expenses.cable_bill, FAKE_NAMES.SLOTH, FAKE_NAMES.SNOWBALL]]
            );
            expect(house.settleDebts()).toEqual([
                {
                    amount: expenses.rent,
                    from: FAKE_NAMES.SLOTH,
                    to: FAKE_NAMES.SNOWBALL,
                },
            ]);
        });

        it("should return all transactions when all members have spent some amount", () => {
            allHaveSpent(house);
            expect(house.settleDebts()).toEqual([
                {
                    from: FAKE_NAMES.WALL_E,
                    to: FAKE_NAMES.SNOWBALL,
                    amount: expenses.fuel_bills,
                },
                {
                    from: FAKE_NAMES.WALL_E,
                    to: FAKE_NAMES.BILBY,
                    amount: expenses.rent,
                },
            ]);
        });

        it("should have the same as sum of net balances, when sum the all transactions ", () => {
            const balances = allHaveSpent(house);
            const expected_total = helpers.computeNetBalance(balances, {
                exclude_debt: true,
            });
            const transactions = house.settleDebts();

            const actual_total = sum(
                transactions.map((transaction) => transaction.amount)
            );
            expect(expected_total).toEqual(actual_total);
        });

        it("should change balance when some dues are cleared", () => {
            changeBalanceEvents(house).initial();
            expect(house.settleDebts()).toEqual([
                {
                    amount: expenses.essentials_cost,
                    from: FAKE_NAMES.MINION,
                    to: FAKE_NAMES.WALL_E,
                },
                {
                    amount: expenses.laundry_bill,
                    from: FAKE_NAMES.BILBY,
                    to: FAKE_NAMES.WALL_E,
                },
            ]);
            changeBalanceEvents(house).final();
            expect(house.settleDebts()).toEqual([
                {
                    from: FAKE_NAMES.BILBY,
                    to: FAKE_NAMES.WALL_E,
                    amount: expenses.laundry_bill,
                },
            ]);
        });
    });
});
