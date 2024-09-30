const helpers = require("../spec_helpers/common.utils");
const expenses = require("../spec_helpers/expenses.utils");
const { FAKE_NAMES } = require("../spec_helpers/constants");
const { INITIAL_BALANCE } = require("../src/constants");
const Store = require("../src/data/store");

describe("DUES", () => {
    let house;
    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation();
        house = helpers.createResidence();
    });

    afterEach(() => {
        Store.reset();
        jest.spyOn(console, "log").mockRestore();
    });

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
                [expenses.pet_care_bills, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL],
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
