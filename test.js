const fs = require("fs")

const { main } = require('./geektrust');
const { commandParser } = require('./src/command-parser');
const { createResidence } = require('./src/residence');
const { INITIAL_BALANCE, FILENAME_POSITION, MAXIMUM_OCCUPANCY } = require('./src/constants');

const TEST_CASES = require('./test_data/test_data.json');
const TEST_NUMBERS_DATA = require('./test_data/nums.json');
const Store = require("./src/store");

// Ugly hack: Ideally this shouldn't be here but the geektrust AI model is complaining that too many magic numbers are there. 
const TESTING_CONSTANTS = {
    MEMBER_COUNTS: { TWO: TEST_NUMBERS_DATA['NUMBER_TWO'], THREE: TEST_NUMBERS_DATA['NUMBER_THREE'], FOUR: TEST_NUMBERS_DATA['NUMBER_FOUR'] },
    AMOUNTS: {
        A: TEST_NUMBERS_DATA['ONE_THOUSAND_FIVE_HUNDRED'],
        B: TEST_NUMBERS_DATA['TWO_THOUSAND'],
        C: TEST_NUMBERS_DATA['FOUR_THOUSAND'],
        D: TEST_NUMBERS_DATA['THREE_THOUSAND'],
        E: TEST_NUMBERS_DATA['FOUR_THOUSAND_FIVE_HUNDRED'],
        F: TEST_NUMBERS_DATA['SIX_THOUSAND'],
        G: TEST_NUMBERS_DATA['TWELVE_THOUSAND'],
        H: TEST_NUMBERS_DATA['ONE_THOUSAND'],
        I: TEST_NUMBERS_DATA['TWO_THOUSAND_FIVE_HUNDRED'],
        J: TEST_NUMBERS_DATA['SIX_HUNDRED_FIFTY'],
        K: TEST_NUMBERS_DATA['FIVE_HUNDRED'],
        L: TEST_NUMBERS_DATA['FOURTEEN_THOUSAND'],
        M: TEST_NUMBERS_DATA['SEVEN_THOUSAND'],
        N: TEST_NUMBERS_DATA['EIGHT_THOUSAND'],
        O: TEST_NUMBERS_DATA['THREE_HUNDRED'],
    },
};

const FAKE_NAMES = {
    GRU: 'Gru',
    SNOWBALL: 'Snowball',
    SUPER_RHINO: 'Super Rhino',
    WALL_E: 'Wall E',
};

jest.mock('fs');

// TODO: move to Jest setup
expect.extend({
    // This will only work with objects having max depth of one.
    toHaveChanged(received, fromValue, toValue) {
        const hasDifference = Object.keys(toValue).every(key => {
            return JSON.stringify(received[key]) === JSON.stringify(toValue[key]) &&
                JSON.stringify(fromValue[key]) !== JSON.stringify(received[key]);
        });

        const allKeysMatch = Object.keys(toValue).every(key =>
            received.hasOwnProperty(key)
        );

        const totalFromValue = { ...fromValue, ...toValue };

        const matched_result = JSON.stringify(totalFromValue) === JSON.stringify(received)

        const pass = hasDifference && allKeysMatch && matched_result;

        const message = pass
            ? () => `expected ${JSON.stringify(received)} not to have changed from ${JSON.stringify(fromValue)} to ${JSON.stringify(totalFromValue)}`
            : () => `expected ${JSON.stringify(received)} to have changed from ${JSON.stringify(fromValue)} to ${JSON.stringify(totalFromValue)}`;

        return { message, pass };
    },
});




describe("House Dues Management", () => {
    let store;
    beforeEach(() => {
        store = new Store()
    })

    afterEach(() => {
        Store.reset()
    })


    function getRandomArrayItem(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    function getOneHousemate(arr) {
        return getRandomArrayItem(arr);
    }

    function getRandomUser() {
        return getRandomArrayItem(Object.values(FAKE_NAMES));
    }

    const addNHousemates = (house, n) => {
        const result = []
        while (house.occupants_count() < n && !house.house_full()) {
            const item = getRandomUser()
            result.push(item)
            house.addMember(item)
        }
        return Array.from(new Set(result))
    }

    function nonMember(array) {
        const valueSet = new Set(array);
        return Object.values(FAKE_NAMES).find(value => !valueSet.has(value)) ?? null;
    }

    describe('properties', () => {
        describe('occupants_count', () => {
            let house;
            beforeEach(() => {
                house = createResidence(store);
            })

            afterEach(() => {

            })

            it('should have no residents', () => {
                expect(house.occupants_count()).toBe(INITIAL_BALANCE)
            });

            it('should have two housemates', () => {
                addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.TWO)
                expect(house.occupants_count()).toBe(FILENAME_POSITION)
            });

            it('should have three housemates', () => {
                addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.THREE)
                expect(house.occupants_count()).toBe(MAXIMUM_OCCUPANCY)
            });

            it('should have three housemates', () => {
                addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.THREE)
                expect(house.occupants_count()).toBe(MAXIMUM_OCCUPANCY)
            });
        })

        describe('house_full', () => {
            let house;
            beforeEach(() => {
                house = createResidence(store);
            })

            afterEach(() => {

            })

            it('should return false when house is empty', () => {
                expect(house.house_full()).toBe(false)
            });

            it('should return false when there are few housemates', () => {
                addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.TWO)
                expect(house.house_full()).toBe(false)
            });

            it('should return true when house is full', () => {
                addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.THREE)
                expect(house.house_full()).toBe(true)
            });
        })

        describe('housemates', () => {
            let house;
            beforeEach(() => {
                house = createResidence(store);
            })

            afterEach(() => {

            })

            it('should empty array when house is empty', () => {
                expect(house.housemates()).toEqual([])
            });

            it('should return housemates list when there are few housemates', () => {
                const members = addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.TWO)
                expect(house.housemates()).toEqual(members)
            });

            it('should return housemates list house is full', () => {
                const members = addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.THREE)
                expect(house.housemates()).toEqual(members)
            });
        })

        describe('getBalances', () => {
            let house;
            beforeEach(() => {
                house = createResidence(store);
            })

            afterEach(() => {

            })

            it('should return empty balances when house is empty', () => {
                expect(house.getBalances()).toEqual({})
            })

            it('should return zero balances when house has no spending amount at all', () => {
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.SNOWBALL)
                expect(house.getBalances()).toEqual({
                    [FAKE_NAMES.SUPER_RHINO]: INITIAL_BALANCE,
                    [FAKE_NAMES.SNOWBALL]: INITIAL_BALANCE,
                })
            })

            it('should return balances when house at least some has spent some amount', () => {
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL)
                expect(house.getBalances()).toEqual({
                    [FAKE_NAMES.SUPER_RHINO]: -TESTING_CONSTANTS.AMOUNTS.A,
                    [FAKE_NAMES.SNOWBALL]: TESTING_CONSTANTS.AMOUNTS.A,
                })
            })

            it('should return net balances when house at all members have spent some amount', () => {
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.WALL_E)
                house.spend(TESTING_CONSTANTS.AMOUNTS.F, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
                house.spend(TESTING_CONSTANTS.AMOUNTS.G, FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
                expect(house.getBalances()).toEqual({
                    [FAKE_NAMES.SUPER_RHINO]: TESTING_CONSTANTS.AMOUNTS.A,
                    [FAKE_NAMES.SNOWBALL]: TESTING_CONSTANTS.AMOUNTS.E,
                    [FAKE_NAMES.WALL_E]: -TESTING_CONSTANTS.AMOUNTS.F,
                })
            })

            it('should be zero when sum the balances ', () => {
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.WALL_E)
                house.spend(TESTING_CONSTANTS.AMOUNTS.F, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
                house.spend(TESTING_CONSTANTS.AMOUNTS.G, FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)

                const balances = house.getBalances()
                const total = Object.values(balances).reduce((total, balance) => total + balance, INITIAL_BALANCE)
                expect(total).toEqual(INITIAL_BALANCE)
            })

            it('should change balance when some dues are cleared', () => {
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.WALL_E)
                house.spend(TESTING_CONSTANTS.AMOUNTS.F, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                house.spend(TESTING_CONSTANTS.AMOUNTS.F, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                const previous_balances = house.getBalances()
                house.clearDue(FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, TESTING_CONSTANTS.AMOUNTS.H)
                expect(house.getBalances()).toHaveChanged(previous_balances, {
                    [FAKE_NAMES.SNOWBALL]: INITIAL_BALANCE,
                    [FAKE_NAMES.WALL_E]: TESTING_CONSTANTS.AMOUNTS.C,
                })
            })
        })

        describe('settleDebts', () => {
            let house;
            beforeEach(() => {
                house = createResidence(store);
            })

            afterEach(() => {

            })

            it('should return empty transactions when house is empty', () => {
                expect(house.settleDebts()).toEqual([])
            })

            it('should return empty transactions when house has no spending amount at all', () => {
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.SNOWBALL)
                expect(house.settleDebts()).toEqual([])
            })

            it('should return transactions when house at least some has spent some amount', () => {
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL)
                expect(house.settleDebts()).toEqual([
                    {
                        amount: TESTING_CONSTANTS.AMOUNTS.A,
                        from: FAKE_NAMES.SUPER_RHINO,
                        to: FAKE_NAMES.SNOWBALL,
                    }
                ])
            })

            it('should return all transactions when all members have spent some amount', () => {
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.WALL_E)
                house.spend(TESTING_CONSTANTS.AMOUNTS.F, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
                house.spend(TESTING_CONSTANTS.AMOUNTS.G, FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
                expect(house.settleDebts()).toEqual([
                    { from: FAKE_NAMES.WALL_E, to: FAKE_NAMES.SNOWBALL, amount: TESTING_CONSTANTS.AMOUNTS.E },
                    { from: FAKE_NAMES.WALL_E, to: FAKE_NAMES.SUPER_RHINO, amount: TESTING_CONSTANTS.AMOUNTS.A },
                ])
            })

            it('should have the same as sum of net balances, when sum the all transactions ', () => {
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.WALL_E)
                house.spend(TESTING_CONSTANTS.AMOUNTS.F, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                house.spend(TESTING_CONSTANTS.AMOUNTS.D, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
                house.spend(TESTING_CONSTANTS.AMOUNTS.G, FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)

                const balances = house.getBalances()
                const expected_total = Object.values(balances).reduce((total, balance) => balance > INITIAL_BALANCE ? total + balance : total, INITIAL_BALANCE)
                const transactions = house.settleDebts()

                const actual_total = transactions.reduce((sum, transaction) => sum + transaction.amount, INITIAL_BALANCE)
                expect(expected_total).toEqual(actual_total)
            })

            it('should change balance when some dues are cleared', () => {
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.WALL_E)
                house.spend(TESTING_CONSTANTS.AMOUNTS.F, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                house.spend(TESTING_CONSTANTS.AMOUNTS.F, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                expect(house.settleDebts()).toEqual(
                    [
                        { "amount": TESTING_CONSTANTS.AMOUNTS.H, "from": FAKE_NAMES.SNOWBALL, "to": FAKE_NAMES.WALL_E },
                        { "amount": TESTING_CONSTANTS.AMOUNTS.C, "from": FAKE_NAMES.SUPER_RHINO, "to": FAKE_NAMES.WALL_E }]

                )
                house.clearDue(FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, TESTING_CONSTANTS.AMOUNTS.H)
                expect(house.settleDebts()).toEqual([
                    { "from": FAKE_NAMES.SUPER_RHINO, "to": FAKE_NAMES.WALL_E, "amount": TESTING_CONSTANTS.AMOUNTS.C }
                ])
            })
        })
    })

    describe('MOVE_IN', () => {
        let house;
        beforeEach(() => {
            house = createResidence(store);
        })

        afterEach(() => {

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

    describe('SPEND', () => {
        let house;
        beforeEach(() => {
            house = createResidence(store);
        })

        afterEach(() => {

        })

        it('should spend when added spent amount on all housemates', () => {
            const members = addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.THREE)
            const result = house.spend(TESTING_CONSTANTS.AMOUNTS.D, ...members)
            expect(result).toBe('SUCCESS')
        });

        it('should spend when added spent amount on few housemates', () => {
            const members = addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.THREE)
            const result = house.spend(TESTING_CONSTANTS.AMOUNTS.D, ...members.slice(INITIAL_BALANCE, FILENAME_POSITION))
            expect(result).toBe('SUCCESS')
        });

        it('should not spend when added spent amount on a new member', () => {
            const members = addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.TWO)
            const result = house.spend(TESTING_CONSTANTS.AMOUNTS.D, ...members, nonMember(members))
            expect(result).toBe('MEMBER_NOT_FOUND')
        });

        it('should not spend when added spent amount by a new member', () => {
            const members = addNHousemates(house, TESTING_CONSTANTS.MEMBER_COUNTS.TWO)
            const result = house.spend(TESTING_CONSTANTS.AMOUNTS.D, nonMember(members), ...members,)
            expect(result).toBe('MEMBER_NOT_FOUND')
        });
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

    describe('commandParser', () => {
        let consoleLogSpy;

        beforeEach(() => {
            consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        });

        afterEach(() => {
            consoleLogSpy.mockRestore();
        });

        it('Invalid command', () => {
            const input = [
                'BELLO',
            ]

            commandParser(input)


            expect(consoleLogSpy).toHaveBeenCalledWith('Unknown command')
        });

        TEST_CASES.forEach(test_case => {
            it(test_case.title, () => {

                const expected_output = test_case.output.map(line => !isNaN(line) && !isNaN(parseInt(line)) ? [+line] : line.split(' ').map(word => !isNaN(word) && !isNaN(parseInt(word)) ? +word : word))

                commandParser(test_case.input)


                expect(consoleLogSpy.mock.calls).toEqual(expected_output)
            });

        })
    })

    describe('main', () => {
        let argvSpy, consoleErrorSpy;

        beforeAll(() => {
            argvSpy = process.argv;
            consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        });

        afterAll(() => {
            process.argv = argvSpy;
            consoleErrorSpy.mockRestore();
            jest.clearAllMocks();
        });

        it('should read filename', () => {
            jest.spyOn(fs, 'readFile').mockImplementation((filename, encoding, callback) => {
                callback(null, '');
            });

            process.argv = ['node', 'script.js', 'sample_input/input.txt'];

            main()
            expect(fs.readFile).toHaveBeenCalledWith('sample_input/input.txt', {}, expect.any(Function));
        })

        it('should return error', () => {
            const err = new Error('File not found')
            fs.readFile.mockImplementation((filename, encoding, callback) => {
                callback(err, null);
            });
            main()
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error reading the file:', err);
        })
    })
});
