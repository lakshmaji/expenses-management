const helpers = require("../spec_helpers/common.utils");
const expenses = require("../spec_helpers/expenses.utils");
const { FAKE_NAMES } = require("../spec_helpers/constants");
const Store = require("../src/data/store");

describe("MOVE_OUT", () => {
    let house;
    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation();
        house = helpers.createResidence();
    });

    afterEach(() => {
        Store.reset();
        jest.spyOn(console, "log").mockRestore();
    });

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
            expenses.RESIDENCE.CAPACITY.SMALL
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
