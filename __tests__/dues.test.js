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

    describe('DUES', () => {
        let house;
        beforeEach(() => {
            house = createResidence(store);
        })

        afterEach(() => {

        })

        it('should not print any dues when house is empty', () => {
            const result = house.dues(FAKE_NAMES.GRU)
            expect(result).toBe('MEMBER_NOT_FOUND')
        });

        it('should not print any dues when not a member of the house', () => {
            house.addMember(FAKE_NAMES.SNOWBALL)
            const result = house.dues(FAKE_NAMES.GRU)
            expect(result).toBe('MEMBER_NOT_FOUND')
        });

        it('should not have any dues when there is no spent at all', () => {
            house.addMember(FAKE_NAMES.SNOWBALL)
            const result = house.dues(FAKE_NAMES.SNOWBALL)
            expect(result).toEqual([])
        });

        it('should not have any dues when no one else have spent any amount', () => {
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.dues(FAKE_NAMES.SNOWBALL)
            expect(result).toEqual([])
        });

        it('should have some dues when some one else have spent amount', () => {
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.addMember(FAKE_NAMES.GRU)
            house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL)
            const result = house.dues(FAKE_NAMES.SNOWBALL)
            expect(result).toEqual([{
                amount: TESTING_CONSTANTS.AMOUNTS.A,
                from: FAKE_NAMES.GRU,
                to: FAKE_NAMES.SNOWBALL,
            }])
        });

        describe('house with default housemates', () => {
            beforeEach(() => {

                house.addMember(FAKE_NAMES.SNOWBALL)
                house.addMember(FAKE_NAMES.GRU)
                house.addMember(FAKE_NAMES.SUPER_RHINO)
            })

            it('should have some dues when few others have spent amount', () => {
                house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL)
                house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL)
                const result = house.dues(FAKE_NAMES.SNOWBALL)
                expect(result).toEqual([{
                    amount: TESTING_CONSTANTS.AMOUNTS.A,
                    from: FAKE_NAMES.GRU,
                    to: FAKE_NAMES.SNOWBALL,
                }, {
                    amount: TESTING_CONSTANTS.AMOUNTS.A,
                    from: FAKE_NAMES.SUPER_RHINO,
                    to: FAKE_NAMES.SNOWBALL,
                }])
            });

            it('should print dues by amount in descending order', () => {
                house.spend(TESTING_CONSTANTS.AMOUNTS.L, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL)
                house.spend(TESTING_CONSTANTS.AMOUNTS.N, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL)
                const result = house.dues(FAKE_NAMES.SNOWBALL)
                expect(result).toEqual([{
                    amount: TESTING_CONSTANTS.AMOUNTS.M,
                    from: FAKE_NAMES.GRU,
                    to: FAKE_NAMES.SNOWBALL,
                }, {
                    amount: TESTING_CONSTANTS.AMOUNTS.C,
                    from: FAKE_NAMES.SUPER_RHINO,
                    to: FAKE_NAMES.SNOWBALL,
                }])
            });

            it('should print no dues when there are no dues', () => {
                house.spend(TESTING_CONSTANTS.AMOUNTS.B, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL)

                const result = house.dues(FAKE_NAMES.SUPER_RHINO)

                expect(result).toEqual([{
                    amount: INITIAL_BALANCE,
                    from: FAKE_NAMES.GRU,
                }, {
                    amount: INITIAL_BALANCE,
                    from: FAKE_NAMES.SNOWBALL,
                }])
            });

            it('should print dues by name in ascending order when amounts are equal', () => {
                house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL)
                house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL)
                const result = house.dues(FAKE_NAMES.SNOWBALL)
                expect(result).toEqual([{
                    amount: TESTING_CONSTANTS.AMOUNTS.A,
                    from: FAKE_NAMES.GRU,
                    to: FAKE_NAMES.SNOWBALL,
                }, {
                    amount: TESTING_CONSTANTS.AMOUNTS.A,
                    from: FAKE_NAMES.SUPER_RHINO,
                    to: FAKE_NAMES.SNOWBALL,
                }])
            });
        })
    })
});
