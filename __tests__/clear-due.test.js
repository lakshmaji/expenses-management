const { createResidence } = require("../test.helpers");
const { INITIAL_BALANCE } = require("../src/constants");

const Store = require("../src/data/store");
const {
    FAKE_NAMES,
    TESTING_CONSTANTS,
    addMembers,
    spendWithRoommates,
} = require("../test.helpers");

describe("CLEAR_DUE", () => {
    let house;
    beforeEach(() => {
        new Store();
        house = createResidence();
    });

    afterEach(() => {
        Store.reset();
    });

    it("should not pay amount when there is spend at all in house", () => {
        addMembers(house, [FAKE_NAMES.T_REX, FAKE_NAMES.SNOWBALL]);
        const result = house.clearDue(
            FAKE_NAMES.T_REX,
            FAKE_NAMES.SNOWBALL,
            TESTING_CONSTANTS.AMOUNTS.B
        );
        expect(result).toBe("INCORRECT_PAYMENT");
    });

    it("should not accept amount when borrower not a member of house", () => {
        addMembers(house, [FAKE_NAMES.SLOTH]);
        const result = house.clearDue(
            FAKE_NAMES.SLOTH,
            FAKE_NAMES.MINION,
            TESTING_CONSTANTS.AMOUNTS.D
        );
        expect(result).toBe("MEMBER_NOT_FOUND");
    });

    it("should not accept amount when lender is not a member of house", () => {
        addMembers(house, [FAKE_NAMES.JACK]);
        const result = house.clearDue(
            FAKE_NAMES.PANDA,
            FAKE_NAMES.JACK,
            TESTING_CONSTANTS.AMOUNTS.I
        );
        expect(result).toBe("MEMBER_NOT_FOUND");
    });

    it("should not accept amount when due is lower than the paying amount", () => {
        addMembers(house, [FAKE_NAMES.DRU, FAKE_NAMES.ANGRY_BIRD]);
        spendWithRoommates(house, [
            [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.ANGRY_BIRD, FAKE_NAMES.DRU],
        ]);
        const result = house.clearDue(
            FAKE_NAMES.DRU,
            FAKE_NAMES.ANGRY_BIRD,
            TESTING_CONSTANTS.AMOUNTS.B
        );
        expect(result).toBe("INCORRECT_PAYMENT");
    });

    it("should not accept amount when he is the one who spent money", () => {
        addMembers(house, [FAKE_NAMES.WALL_E, FAKE_NAMES.TANGLED]);
        spendWithRoommates(house, [
            [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.TANGLED, FAKE_NAMES.WALL_E],
        ]);
        const result = house.clearDue(
            FAKE_NAMES.TANGLED,
            FAKE_NAMES.WALL_E,
            TESTING_CONSTANTS.AMOUNTS.B
        );
        expect(result).toBe("INCORRECT_PAYMENT");
    });

    it("should accept amount when due is higher than paying amount", () => {
        addMembers(house, [FAKE_NAMES.TURBO, FAKE_NAMES.MINION]);
        spendWithRoommates(house, [
            [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.MINION, FAKE_NAMES.TURBO],
        ]);
        const result = house.clearDue(
            FAKE_NAMES.TURBO,
            FAKE_NAMES.MINION,
            TESTING_CONSTANTS.AMOUNTS.H
        );
        expect(result).toBe(TESTING_CONSTANTS.AMOUNTS.K);
    });

    it("should accept amount when due is equal paying amount", () => {
        addMembers(house, [FAKE_NAMES.GRU, FAKE_NAMES.JACK]);
        spendWithRoommates(house, [
            [TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.JACK, FAKE_NAMES.GRU],
        ]);
        const result = house.clearDue(
            FAKE_NAMES.GRU,
            FAKE_NAMES.JACK,
            TESTING_CONSTANTS.AMOUNTS.A
        );
        expect(result).toBe(INITIAL_BALANCE);
    });
});
