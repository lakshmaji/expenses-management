const { createResidence } = require('../src/residence');
const { INITIAL_BALANCE } = require('../src/constants');

const Store = require("../src/store");
const { FAKE_NAMES, TESTING_CONSTANTS } = require('../test.helpers');



describe("House Dues Management", () => {
    let store;
    beforeEach(() => {
        store = new Store()
    })

    afterEach(() => {
        Store.reset()
    })

    describe('CLEAR_DUE', () => {
        let house;
        beforeEach(() => {
            house = createResidence(store);
        })

        afterEach(() => {

        })

        it('should not pay amount when there is spend at all in house', () => {
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            const result = house.clearDue(FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, TESTING_CONSTANTS.AMOUNTS.B)
            expect(result).toBe('INCORRECT_PAYMENT')
        });

        it('should not accept amount when borrower not a member of house', () => {
            house.addMember(FAKE_NAMES.SNOWBALL)
            const result = house.clearDue(FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU, TESTING_CONSTANTS.AMOUNTS.B)
            expect(result).toBe('MEMBER_NOT_FOUND')
        });

        it('should not accept amount when lender is not a member of house', () => {
            house.addMember(FAKE_NAMES.SNOWBALL)
            const result = house.clearDue(FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, TESTING_CONSTANTS.AMOUNTS.B)
            expect(result).toBe('MEMBER_NOT_FOUND')
        });

        it('should not accept amount when due is lower than the paying amount', () => {
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.clearDue(FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, TESTING_CONSTANTS.AMOUNTS.B)
            expect(result).toBe('INCORRECT_PAYMENT')
        });

        it('should not accept amount when he is the one who spent money', () => {
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.clearDue(FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU, TESTING_CONSTANTS.AMOUNTS.B)
            expect(result).toBe('INCORRECT_PAYMENT')
        });

        it('should accept amount when due is higher than paying amount', () => {
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.clearDue(FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, TESTING_CONSTANTS.AMOUNTS.H)
            expect(result).toBe(TESTING_CONSTANTS.AMOUNTS.K)
        });

        it('should accept amount when due is equal paying amount', () => {
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.clearDue(FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, TESTING_CONSTANTS.AMOUNTS.A)
            expect(result).toBe(INITIAL_BALANCE)
        });
    })
});
