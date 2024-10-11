const helpers = require("../spec_helpers/common.utils");
const expenses = require("../spec_helpers/expenses.utils");
const { FAKE_NAMES } = require("../spec_helpers/constants");
const { INITIAL_BALANCE, FILENAME_POSITION, MAXIMUM_OCCUPANCY } = require("../src/constants");
const Store = require("../src/data/store");

describe("Expenses management", () => {
    let house;

    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation();
        house = helpers.createResidence();
    });

    afterEach(() => {
        Store.reset();
        jest.clearAllMocks();
    });

    describe('properties', () => {

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
    })

    describe("MOVE_IN", () => {
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

    describe("SPEND", () => {
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

    describe("DUES", () => {
        const prettyPrintDues = (dues) => {
            return dues.map((due) => `${due.from} ${due.amount}`);
        };

        it("should not print any dues when house is empty", () => {
            const result = house.dues(FAKE_NAMES.JACK);
            expect(result).toBe("MEMBER_NOT_FOUND");
        });

        it("should not print any dues when not a member of the house", () => {
            helpers.addMembers(house, [FAKE_NAMES.BILBY]);
            const result = house.dues(FAKE_NAMES.TURBO);
            expect(result).toBe("MEMBER_NOT_FOUND");
        });

        it("should not have any dues when there is no spent at all", () => {
            helpers.addMembers(house, [FAKE_NAMES.ANGRY_BIRD]);
            const result = house.dues(FAKE_NAMES.ANGRY_BIRD);
            expect(result).toEqual(prettyPrintDues([]));
        });

        it("should not have any dues when no one else have spent any amount", () => {
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.PUPPY, FAKE_NAMES.TANGLED],
                [[expenses.cable_bill, FAKE_NAMES.PUPPY, FAKE_NAMES.TANGLED]]
            );
            const result = house.dues(FAKE_NAMES.PUPPY);
            expect(result).toEqual(
                prettyPrintDues([{ amount: INITIAL_BALANCE, from: FAKE_NAMES.TANGLED }])
            );
        });

        it("should have some dues when some one else have spent amount", () => {
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.PANDA, FAKE_NAMES.GRU],
                [[expenses.cable_bill, FAKE_NAMES.GRU, FAKE_NAMES.PANDA]]
            );
            const result = house.dues(FAKE_NAMES.PANDA);
            expect(result).toEqual(
                prettyPrintDues([
                    {
                        amount: expenses.rent,
                        from: FAKE_NAMES.GRU,
                        to: FAKE_NAMES.PANDA,
                    },
                ])
            );
        });

        it("should have some dues when few others have spent amount", () => {
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.WALL_E, FAKE_NAMES.GRU, FAKE_NAMES.T_REX],
                [
                    [expenses.cable_bill, FAKE_NAMES.T_REX, FAKE_NAMES.WALL_E],
                    [expenses.cable_bill, FAKE_NAMES.GRU, FAKE_NAMES.WALL_E],
                ]
            );

            const result = house.dues(FAKE_NAMES.WALL_E);

            expect(result).toEqual(
                prettyPrintDues([
                    {
                        amount: expenses.rent,
                        from: FAKE_NAMES.GRU,
                        to: FAKE_NAMES.WALL_E,
                    },
                    {
                        amount: expenses.rent,
                        from: FAKE_NAMES.T_REX,
                        to: FAKE_NAMES.WALL_E,
                    },
                ])
            );
        });

        it("should print dues by amount in descending order", () => {
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.SNOWBALL, FAKE_NAMES.MINION, FAKE_NAMES.SUPER_RHINO],
                [
                    [expenses.electricity_bills, FAKE_NAMES.MINION, FAKE_NAMES.SNOWBALL],
                    [
                        expenses.pet_care_bills,
                        FAKE_NAMES.SUPER_RHINO,
                        FAKE_NAMES.SNOWBALL,
                    ],
                ]
            );

            const result = house.dues(FAKE_NAMES.SNOWBALL);
            expect(result).toEqual(
                prettyPrintDues([
                    {
                        amount: expenses.gym_membership,
                        from: FAKE_NAMES.MINION,
                        to: FAKE_NAMES.SNOWBALL,
                    },
                    {
                        amount: expenses.laundry_bill,
                        from: FAKE_NAMES.SUPER_RHINO,
                        to: FAKE_NAMES.SNOWBALL,
                    },
                ])
            );
        });

        it("should print no dues when there are no dues", () => {
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.FOR_THE_BIRDS, FAKE_NAMES.GRU, FAKE_NAMES.SUPER_RHINO],
                [[expenses.internet_bill, FAKE_NAMES.GRU, FAKE_NAMES.FOR_THE_BIRDS]]
            );

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
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.DRU, FAKE_NAMES.WALL_E, FAKE_NAMES.SUPER_RHINO],
                [
                    [expenses.cable_bill, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.DRU],
                    [expenses.cable_bill, FAKE_NAMES.WALL_E, FAKE_NAMES.DRU],
                ]
            );
            const result = house.dues(FAKE_NAMES.DRU);
            expect(result).toEqual(
                prettyPrintDues([
                    {
                        amount: expenses.rent,
                        from: FAKE_NAMES.SUPER_RHINO,
                        to: FAKE_NAMES.DRU,
                    },
                    {
                        amount: expenses.rent,
                        from: FAKE_NAMES.WALL_E,
                        to: FAKE_NAMES.DRU,
                    },
                ])
            );
        });
    });

    describe("CLEAR_DUE", () => {
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
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.DRU, FAKE_NAMES.ANGRY_BIRD],
                [[expenses.cable_bill, FAKE_NAMES.ANGRY_BIRD, FAKE_NAMES.DRU]]
            );
            const result = house.clearDue(
                FAKE_NAMES.DRU,
                FAKE_NAMES.ANGRY_BIRD,
                expenses.internet_bill
            );
            expect(result).toBe("INCORRECT_PAYMENT");
        });

        it("should not accept amount when he is the one who spent money", () => {
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.WALL_E, FAKE_NAMES.TANGLED],
                [[expenses.cable_bill, FAKE_NAMES.TANGLED, FAKE_NAMES.WALL_E]]
            );
            const result = house.clearDue(
                FAKE_NAMES.TANGLED,
                FAKE_NAMES.WALL_E,
                expenses.internet_bill
            );
            expect(result).toBe("INCORRECT_PAYMENT");
        });

        it("should accept amount when due is higher than paying amount", () => {
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.TURBO, FAKE_NAMES.MINION],
                [[expenses.cable_bill, FAKE_NAMES.MINION, FAKE_NAMES.TURBO]]
            );
            const result = house.clearDue(
                FAKE_NAMES.TURBO,
                FAKE_NAMES.MINION,
                expenses.essentials_cost
            );
            expect(result).toBe(expenses.library_bills);
        });

        it("should accept amount when due is equal paying amount", () => {
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.GRU, FAKE_NAMES.JACK],
                [[expenses.cable_bill, FAKE_NAMES.JACK, FAKE_NAMES.GRU]]
            );
            const result = house.clearDue(
                FAKE_NAMES.GRU,
                FAKE_NAMES.JACK,
                expenses.rent
            );
            expect(result).toBe(INITIAL_BALANCE);
        });
    });

    describe("MOVE_OUT", () => {
        it("should move out a member they do not have any spending by any members in the house", () => {
            const members = helpers.addNHousemates(
                house,
                expenses.RESIDENCE.CAPACITY.MEDIUM
            );
            const result = house.moveOut(helpers.getOneHousemate(members));
            expect(result).toBe("SUCCESS");
        });

        it("should not move out when trying to move a non member of the house", () => {
            const members = helpers.addNHousemates(
                house,
                expenses.RESIDENCE.CAPACITY.X_LARGE
            );
            const result = house.moveOut(helpers.nonMember(members));
            expect(result).toBe("MEMBER_NOT_FOUND");
        });

        it("should not move out when trying to move a member with due", () => {
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.PANDA, FAKE_NAMES.JACK],
                [[expenses.cable_bill, FAKE_NAMES.JACK, FAKE_NAMES.PANDA]]
            );
            const result = house.moveOut(FAKE_NAMES.PANDA);
            expect(result).toBe("FAILURE");
        });

        it("should not move out when member owed by others", () => {
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL],
                [[expenses.essentials_cost, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU]]
            );
            const result = house.moveOut(FAKE_NAMES.SNOWBALL);
            expect(result).toBe("FAILURE");
        });

        it("should not move out when member do not have dues", () => {
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.TURBO, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO],
                [
                    [
                        expenses.cable_bill,
                        FAKE_NAMES.TURBO,
                        FAKE_NAMES.SNOWBALL,
                        FAKE_NAMES.SUPER_RHINO,
                    ],
                    [
                        expenses.grocery_expenses,
                        FAKE_NAMES.SNOWBALL,
                        FAKE_NAMES.SUPER_RHINO,
                    ],
                ]
            );
            helpers.clearMemberDues(house, [
                [FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.TURBO, expenses.library_bills],
                [FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.TURBO, expenses.phone_bills],
                [FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.TURBO, expenses.food_bills],
            ]);
            const result = house.moveOut(FAKE_NAMES.SUPER_RHINO);
            expect(result).toBe("SUCCESS");
        });

        it("should move out a individual who doesnt owed to anyone and no dues", () => {
            helpers.addMembersAndSpend(
                house,
                [FAKE_NAMES.FOR_THE_BIRDS, FAKE_NAMES.T_REX, FAKE_NAMES.PIPER],
                [
                    [
                        expenses.cable_bill,
                        FAKE_NAMES.FOR_THE_BIRDS,
                        FAKE_NAMES.T_REX,
                        FAKE_NAMES.PIPER,
                    ],
                    [
                        expenses.cable_bill,
                        FAKE_NAMES.T_REX,
                        FAKE_NAMES.PIPER,
                        FAKE_NAMES.FOR_THE_BIRDS,
                    ],
                    [expenses.internet_bill, FAKE_NAMES.PIPER, FAKE_NAMES.T_REX],
                ]
            );
            expect(house.moveOut(FAKE_NAMES.FOR_THE_BIRDS)).toEqual("FAILURE");
            expect(house.moveOut(FAKE_NAMES.PIPER)).toEqual("FAILURE");
            expect(house.moveOut(FAKE_NAMES.T_REX)).toEqual("SUCCESS");
        });
    });

});
