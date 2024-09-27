const { createResidence } = require('../src/residence');
const Store = require("../src/store");
const { addNHousemates, TESTING_CONSTANTS, FAKE_NAMES } = require("../test.helpers");

describe("House Dues Management", () => {    
    describe('MOVE_IN', () => {
        let house;
        let store;
        beforeEach(() => {
            store = new Store()
            house = createResidence();
        })
        
        afterEach(() => {
            Store.reset()
        })

        it('should welcome a new member to house when house is empty', () => {
            const result = house.addMember(FAKE_NAMES.SUPER_RHINO)
            expect(result).toBe('SUCCESS')
        });

        it('should welcome a new member to house when house is not full', () => {
            addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.TWO)
            const result = house.addMember(FAKE_NAMES.SUPER_RHINO)
            expect(result).toBe('SUCCESS')
        });

        it('should not welcome a new member to house when houseful', () => {
            addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.THREE)
            const result = house.addMember(FAKE_NAMES.SUPER_RHINO)
            expect(result).toBe('HOUSEFUL')
        });
    })
});
