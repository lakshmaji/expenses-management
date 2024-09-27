const { createResidence } = require('../src/residence');

const Store = require("../src/store");
const { addNHousemates, TESTING_CONSTANTS, getOneHousemate, nonMember, FAKE_NAMES } = require('../test.helpers');

describe("House Dues Management", () => {
    let store;
    beforeEach(() => {
        store = new Store()
    })

    afterEach(() => {
        Store.reset()
    })
    
    describe('MOVE_OUT', () => {
        let house;
        beforeEach(() => {
            house = createResidence(store);
        })

        afterEach(() => {

        })

        it('should move out a member they do not have any spending by any members in the house', () => {
            const members = addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.THREE)
            const result = house.moveOut(getOneHousemate(members))
            expect(result).toBe('SUCCESS')
        });

        it('should not move out when trying to move a non member of the house', () => {
            const members = addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.TWO)
            const result = house.moveOut(nonMember(members))
            expect(result).toBe('MEMBER_NOT_FOUND')
        });

        it('should not move out when trying to move a member with due', () => {
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.moveOut(FAKE_NAMES.GRU)
            expect(result).toBe('FAILURE')
        });

        it('should not move out when member owed by others', () => {
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.moveOut(FAKE_NAMES.SNOWBALL)
            expect(result).toBe('FAILURE')
        });

        it('should not move out when member do not have dues', () => {
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.addMember(FAKE_NAMES.SUPER_RHINO)
            house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
            house.spend(TESTING_CONSTANTS.AMOUNTS.O, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
            house.clearDue(FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.GRU, TESTING_CONSTANTS.AMOUNTS.K)
            house.clearDue(FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.GRU, TESTING_CONSTANTS.AMOUNTS.I)
            house.clearDue(FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.GRU, TESTING_CONSTANTS.AMOUNTS.J)
            const result = house.moveOut(FAKE_NAMES.SUPER_RHINO)
            expect(result).toBe('SUCCESS')
        });

        it('should move out a individual who doesnt owed to anyone and no dues', () => {
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.addMember(FAKE_NAMES.SUPER_RHINO)
            house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
            house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU, FAKE_NAMES.SUPER_RHINO)
            house.spend(TESTING_CONSTANTS.AMOUNTS.B, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL)
            expect(house.moveOut(FAKE_NAMES.GRU)).toEqual('FAILURE')
            expect(house.moveOut(FAKE_NAMES.SUPER_RHINO)).toEqual('FAILURE')
            expect(house.moveOut(FAKE_NAMES.SNOWBALL)).toEqual('SUCCESS')
        });
    })
});
