
const { createResidence, processCommands, main } = require('./geektrust');
const fs = require("fs")

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

    const FAKE_NAMES = {
        GRU: 'Gru',
        SNOWBALL: 'Snowball',
        SUPER_RHINO: 'Super Rhino',
        WALL_E: 'Wall E',
    }

    function getRandomValue(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    function getOneHousemate(arr) {
        return getRandomValue(arr);
    }

    function getRandomUser() {
        const arr = Object.values(FAKE_NAMES);
        return getRandomValue(arr);
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
    const MEMBER_COUNTS = {TWO:2, THREE: 3, FOUR: 4};

    function findFirstMissingValue(array) {
        const valueSet = new Set(array);
        return Object.values(FAKE_NAMES).find(value => !valueSet.has(value)) ?? null;
    }

    describe('properties', () => {
        describe('occupants_count', () => {
            it('should have no residents', () => {
                const house = createResidence();
                expect(house.occupants_count()).toBe(0)
            });

            it('should have 2 housemates', () => {
                const house = createResidence();
                addNHousemates(house, MEMBER_COUNTS.TWO)
                expect(house.occupants_count()).toBe(2)
            });

            it('should have 3 housemates', () => {
                const house = createResidence();
                addNHousemates(house, MEMBER_COUNTS.THREE)
                expect(house.occupants_count()).toBe(3)
            });

            it('should have 3 housemates', () => {
                const house = createResidence();
                addNHousemates(house, MEMBER_COUNTS.THREE)
                expect(house.occupants_count()).toBe(3)
            });
        })

        describe('house_full', () => {
            it('should return false when house is empty', () => {
                const house = createResidence();
                expect(house.house_full()).toBe(false)
            });

            it('should return false when there are few housemates', () => {
                const house = createResidence();
                addNHousemates(house, MEMBER_COUNTS.TWO)
                expect(house.house_full()).toBe(false)
            });

            it('should return true when house is full', () => {
                const house = createResidence();
                addNHousemates(house, MEMBER_COUNTS.THREE)
                expect(house.house_full()).toBe(true)
            });
        })

        describe('housemates', () => {
            it('should empty array when house is empty', () => {
                const house = createResidence();
                expect(house.housemates()).toEqual([])
            });

            it('should return housemates list when there are few housemates', () => {
                const house = createResidence();
                const members = addNHousemates(house, MEMBER_COUNTS.TWO)
                expect(house.housemates()).toEqual(members)
            });

            it('should return housemates list house is full', () => {
                const house = createResidence();
                const members = addNHousemates(house, MEMBER_COUNTS.THREE)
                expect(house.housemates()).toEqual(members)
            });
        })

        describe('getBalances', () => {
            it('should return empty balances when house is empty', () => {
                const house = createResidence()
                expect(house.getBalances()).toEqual({})
            })

            it('should return zero balances when house has no spending amount at all', () => {
                const house = createResidence()
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.SNOWBALL)
                expect(house.getBalances()).toEqual({
                    [FAKE_NAMES.SUPER_RHINO]: 0,
                    [FAKE_NAMES.SNOWBALL]: 0,
                })
            })

            it('should return balances when house at least some has spent some amount', () => {
                const house = createResidence()
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.spend(3000, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL)
                expect(house.getBalances()).toEqual({
                    [FAKE_NAMES.SUPER_RHINO]: -1500,
                    [FAKE_NAMES.SNOWBALL]: 1500,
                })
            })

            it('should return net balances when house at all members have spent some amount', () => {
                const house = createResidence()
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.WALL_E)
                house.spend(6000, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                house.spend(3000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
                house.spend(12000, FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
                expect(house.getBalances()).toEqual({
                    [FAKE_NAMES.SUPER_RHINO]: 1500,
                    [FAKE_NAMES.SNOWBALL]: 4500,
                    [FAKE_NAMES.WALL_E]: -6000,
                })
            })

            it('should be zero when sum the balances ', () => {
                const house = createResidence()
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.WALL_E)
                house.spend(6000, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                house.spend(3000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
                house.spend(12000, FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)

                const balances = house.getBalances()
                const total = Object.values(balances).reduce((total, balance) => total + balance, 0)
                expect(total).toEqual(0)
            })

            it('should change balance when some dues are cleared', () => {
                const house = createResidence()
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.WALL_E)
                house.spend(6000, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                house.spend(6000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                const previous_balances = house.getBalances()
                house.clearDue(FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, 1000)
                expect(house.getBalances()).toHaveChanged(previous_balances, {
                    [FAKE_NAMES.SNOWBALL]: 0,
                    [FAKE_NAMES.WALL_E]: 4000,
                })
            })
        })

        describe('settleDebts', () => {
            it('should return empty transactions when house is empty', () => {
                const house = createResidence()
                expect(house.settleDebts()).toEqual([])
            })

            it('should return empty transactions when house has no spending amount at all', () => {
                const house = createResidence()
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.SNOWBALL)
                expect(house.settleDebts()).toEqual([])
            })

            it('should return transactions when house at least some has spent some amount', () => {
                const house = createResidence()
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.spend(3000, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL)
                expect(house.settleDebts()).toEqual([
                    {
                        amount: 1500,
                        from: FAKE_NAMES.SUPER_RHINO,
                        to: FAKE_NAMES.SNOWBALL,
                    }
                ])
            })

            it('should return all transactions when all members have spent some amount', () => {
                const house = createResidence()
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.WALL_E)
                house.spend(6000, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                house.spend(3000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
                house.spend(12000, FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
                expect(house.settleDebts()).toEqual([
                    { from: FAKE_NAMES.WALL_E, to: FAKE_NAMES.SNOWBALL, amount: 4500 },
                    { from: FAKE_NAMES.WALL_E, to: FAKE_NAMES.SUPER_RHINO, amount: 1500 },
                ])
            })

            it('should have the same as sum of net balances, when sum the all transactions ', () => {
                const house = createResidence()
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.WALL_E)
                house.spend(6000, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                house.spend(3000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
                house.spend(12000, FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)

                const balances = house.getBalances()
                const expected_total = Object.values(balances).reduce((total, balance) => balance > 0 ? total + balance : total, 0)
                const transactions = house.settleDebts()

                const actual_total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
                expect(expected_total).toEqual(actual_total)
            })

            it('should change balance when some dues are cleared', () => {
                const house = createResidence()
                house.addMember(FAKE_NAMES.SNOWBALL)
                house.addMember(FAKE_NAMES.SUPER_RHINO)
                house.addMember(FAKE_NAMES.WALL_E)
                house.spend(6000, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                house.spend(6000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E)
                expect(house.settleDebts()).toEqual(
                    [
                        { "amount": 1000, "from": FAKE_NAMES.SNOWBALL, "to": FAKE_NAMES.WALL_E },
                        { "amount": 4000, "from": FAKE_NAMES.SUPER_RHINO, "to": FAKE_NAMES.WALL_E }]

                )
                house.clearDue(FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, 1000)
                expect(house.settleDebts()).toEqual([
                    { "from": FAKE_NAMES.SUPER_RHINO, "to": FAKE_NAMES.WALL_E, "amount": 4000 }
                ])
            })
        })
    })

    describe('MOVE_IN', () => {
        it('should welcome a new member to house when house is empty', () => {
            const house = createResidence();
            const result = house.addMember(FAKE_NAMES.SUPER_RHINO)
            expect(result).toBe('SUCCESS')
        });

        it('should welcome a new member to house when house is not full', () => {
            const house = createResidence();
            addNHousemates(house, MEMBER_COUNTS.TWO)
            const result = house.addMember(FAKE_NAMES.SUPER_RHINO)
            expect(result).toBe('SUCCESS')
        });

        it('should not welcome a new member to house when houseful', () => {
            const house = createResidence();
            addNHousemates(house, MEMBER_COUNTS.THREE)
            const result = house.addMember(FAKE_NAMES.SUPER_RHINO)
            expect(result).toBe('HOUSEFUL')
        });
    })

    describe('SPEND', () => {
        it('should spend when added spent amount on all housemates', () => {
            const house = createResidence();
            const members = addNHousemates(house, MEMBER_COUNTS.THREE)
            const result = house.spend(3000, ...members)
            expect(result).toBe('SUCCESS')
        });

        it('should spend when added spent amount on few housemates', () => {
            const house = createResidence();
            const members = addNHousemates(house, MEMBER_COUNTS.THREE)
            const result = house.spend(3000, ...members.slice(0, 2))
            expect(result).toBe('SUCCESS')
        });

        it('should not spend when added spent amount on a new member', () => {
            const house = createResidence();
            const members = addNHousemates(house, MEMBER_COUNTS.TWO)
            const result = house.spend(3000, ...members, findFirstMissingValue(members))
            expect(result).toBe('MEMBER_NOT_FOUND')
        });

        it('should not spend when added spent amount by a new member', () => {
            const house = createResidence();
            const members = addNHousemates(house, MEMBER_COUNTS.TWO)
            const result = house.spend(3000, findFirstMissingValue(members), ...members,)
            expect(result).toBe('MEMBER_NOT_FOUND')
        });
    })

    describe('DUES', () => {
        it('should not print any dues when house is empty', () => {
            const house = createResidence();
            const result = house.dues(FAKE_NAMES.GRU)
            expect(result).toBe('MEMBER_NOT_FOUND')
        });

        it('should not print any dues when not a member of the house', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.SNOWBALL)
            const result = house.dues(FAKE_NAMES.GRU)
            expect(result).toBe('MEMBER_NOT_FOUND')
        });

        it('should not have any dues when there is no spent at all', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.SNOWBALL)
            const result = house.dues(FAKE_NAMES.SNOWBALL)
            expect(result).toEqual([])
        });

        it('should not have any dues when no one else have spent any amount', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(3000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.dues(FAKE_NAMES.SNOWBALL)
            expect(result).toEqual([])
        });

        it('should have some dues when some one else have spent amount', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.addMember(FAKE_NAMES.GRU)
            house.spend(3000, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL)
            const result = house.dues(FAKE_NAMES.SNOWBALL)
            expect(result).toEqual([{
                amount: 1500,
                from: FAKE_NAMES.GRU,
                to: FAKE_NAMES.SNOWBALL,
            }])
        });

        it('should have some dues when few others have spent amount', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SUPER_RHINO)
            house.spend(3000, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL)
            house.spend(3000, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL)
            const result = house.dues(FAKE_NAMES.SNOWBALL)
            expect(result).toEqual([{
                amount: 1500,
                from: FAKE_NAMES.GRU,
                to: FAKE_NAMES.SNOWBALL,
            }, {
                amount: 1500,
                from: FAKE_NAMES.SUPER_RHINO,
                to: FAKE_NAMES.SNOWBALL,
            }])
        });

        it('should print dues by amount in descending order', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.addMember(FAKE_NAMES.SUPER_RHINO)
            house.addMember(FAKE_NAMES.GRU)
            house.spend(14000, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL)
            house.spend(8000, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL)
            const result = house.dues(FAKE_NAMES.SNOWBALL)
            expect(result).toEqual([{
                amount: 7000,
                from: FAKE_NAMES.GRU,
                to: FAKE_NAMES.SNOWBALL,
            }, {
                amount: 4000,
                from: FAKE_NAMES.SUPER_RHINO,
                to: FAKE_NAMES.SNOWBALL,
            }])
        });

        it('should print no dues when there are no dues', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SUPER_RHINO)
            house.spend(2000, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL)

            const result = house.dues(FAKE_NAMES.SUPER_RHINO)

            expect(result).toEqual([{
                amount: 0,
                from: FAKE_NAMES.GRU,
            }, {
                amount: 0,
                from: FAKE_NAMES.SNOWBALL,
            }])
        });

        it('should print dues by name in ascending order when amounts are equal', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SUPER_RHINO)
            house.spend(3000, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL)
            house.spend(3000, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL)
            const result = house.dues(FAKE_NAMES.SNOWBALL)
            expect(result).toEqual([{
                amount: 1500,
                from: FAKE_NAMES.GRU,
                to: FAKE_NAMES.SNOWBALL,
            }, {
                amount: 1500,
                from: FAKE_NAMES.SUPER_RHINO,
                to: FAKE_NAMES.SNOWBALL,
            }])
        });
    })

    describe('CLEAR_DUE', () => {
        it('should not pay amount when there is spend at all in house', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            const result = house.clearDue(FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, 2000)
            expect(result).toBe('INCORRECT_PAYMENT')
        });

        it('should not accept amount when borrower not a member of house', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.SNOWBALL)
            const result = house.clearDue(FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU, 2000)
            expect(result).toBe('MEMBER_NOT_FOUND')
        });

        it('should not accept amount when lender is not a member of house', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.SNOWBALL)
            const result = house.clearDue(FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, 2000)
            expect(result).toBe('MEMBER_NOT_FOUND')
        });

        it('should not accept amount when due is lower than the paying amount', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(3000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.clearDue(FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, 2000)
            expect(result).toBe('INCORRECT_PAYMENT')
        });

        it('should not accept amount when he is the one who spent money', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(3000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.clearDue(FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU, 2000)
            expect(result).toBe('INCORRECT_PAYMENT')
        });

        it('should accept amount when due is higher than paying amount', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(3000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.clearDue(FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, 1000)
            expect(result).toBe(500)
        });

        it('should accept amount when due is equal paying amount', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(3000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.clearDue(FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, 1500)
            expect(result).toBe(0)
        });
    })

    describe('MOVE_OUT', () => {
        it('should move out a member they do not have any spending by any members in the house', () => {
            const house = createResidence();
            const members = addNHousemates(house, MEMBER_COUNTS.THREE)
            const result = house.moveOut(getOneHousemate(members))
            expect(result).toBe('SUCCESS')
        });

        it('should not move out when trying to move a non member of the house', () => {
            const house = createResidence();
            const members = addNHousemates(house, MEMBER_COUNTS.TWO)
            const result = house.moveOut(findFirstMissingValue(members))
            expect(result).toBe('MEMBER_NOT_FOUND')
        });

        it('should not move out when trying to move a member with due', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(3000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.moveOut(FAKE_NAMES.GRU)
            expect(result).toBe('FAILURE')
        });

        it('should not move out when member owed by others', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(3000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.moveOut(FAKE_NAMES.SNOWBALL)
            expect(result).toBe('FAILURE')
        });

        it('should not move out when member do not have dues', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.addMember(FAKE_NAMES.SUPER_RHINO)
            house.spend(3000, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
            house.spend(300, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
            house.clearDue(FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.GRU, 500)
            house.clearDue(FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.GRU, 2500)
            house.clearDue(FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.GRU, 650)
            const result = house.moveOut(FAKE_NAMES.SUPER_RHINO)
            expect(result).toBe('SUCCESS')
        });

        it('should move out a individual who doesnt owed to anyone and no dues', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.addMember(FAKE_NAMES.SUPER_RHINO)
            house.spend(3000, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL, FAKE_NAMES.SUPER_RHINO)
            house.spend(3000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU, FAKE_NAMES.SUPER_RHINO)
            house.spend(2000, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL)
            const result1 = house.moveOut(FAKE_NAMES.GRU)
            const result2 = house.moveOut(FAKE_NAMES.SUPER_RHINO)
            const result3 = house.moveOut(FAKE_NAMES.SNOWBALL)
            expect(result1).toEqual('FAILURE')
            expect(result2).toEqual('FAILURE')
            expect(result3).toEqual('SUCCESS')
        });
    })

    describe('processCommands', () => {
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

            processCommands(input)


            expect(consoleLogSpy).toHaveBeenCalledWith('Unknown command')
        });
        it('Test case 1', () => {
            const input = [
                'MOVE_IN ANDY',
                'MOVE_IN WOODY',
                'MOVE_IN BO',
                'MOVE_IN REX',
                'SPEND 3000 ANDY WOODY BO',
                'SPEND 300 WOODY BO',
                'SPEND 300 WOODY REX',
                'DUES BO',
                'DUES WOODY',
                'CLEAR_DUE BO ANDY 500',
                'CLEAR_DUE BO ANDY 2500',
                'MOVE_OUT ANDY',
                'MOVE_OUT WOODY',
                'MOVE_OUT BO',
                'CLEAR_DUE BO ANDY 650',
                'MOVE_OUT BO',
            ]

            const expected_output = [
                'SUCCESS',
                'SUCCESS',
                'SUCCESS',
                'HOUSEFUL',
                'SUCCESS',
                'SUCCESS',
                'MEMBER_NOT_FOUND',
                'ANDY 1150',
                'WOODY 0',
                'ANDY 850',
                'BO 0',
                '650',
                'INCORRECT_PAYMENT',
                'FAILURE',
                'FAILURE',
                'FAILURE',
                '0',
                'SUCCESS',
            ].map(line => !isNaN(line) && !isNaN(parseInt(line)) ? [+line] : line.split(' ').map(word => !isNaN(word) && !isNaN(parseInt(word)) ? +word : word))

            processCommands(input)


            expect(consoleLogSpy.mock.calls).toEqual(expected_output)
        });

        it('Test case 2', () => {
            const input = [
                'MOVE_IN ANDY',
                'MOVE_IN WOODY',
                'MOVE_IN BO',
                'SPEND 6000 WOODY ANDY BO',
                'SPEND 6000 ANDY BO',
                'DUES ANDY',
                'DUES BO',
                'CLEAR_DUE BO ANDY 1000',
                'CLEAR_DUE BO WOODY 4000',
                'MOVE_OUT ANDY',
                'MOVE_OUT WOODY',
            ]

            const expected_output = [
                'SUCCESS',
                'SUCCESS',
                'SUCCESS',
                'SUCCESS',
                'SUCCESS',
                'BO 0',
                'WOODY 0',
                'WOODY 4000',
                'ANDY 1000',
                '0',
                '0',
                'SUCCESS',
                'SUCCESS',
            ].map(line => !isNaN(line) && !isNaN(parseInt(line)) ? [+line] : line.split(' ').map(word => !isNaN(word) && !isNaN(parseInt(word)) ? +word : word))

            processCommands(input)


            expect(consoleLogSpy.mock.calls).toEqual(expected_output)
        });

        it('Test case 3', () => {
            const input = [
                'SPEND 1000 WOODY ANDY',
                'DUES ANDY',
                'MOVE_IN ANDY',
                'SPEND 1000 ANDY REX',
                'MOVE_OUT ANDY',
                'CLEAR_DUE ANDY WOODY 500',
            ]

            const expected_output = [
                'MEMBER_NOT_FOUND',
                'MEMBER_NOT_FOUND',
                'SUCCESS',
                'MEMBER_NOT_FOUND',
                'SUCCESS',
                'MEMBER_NOT_FOUND',
            ].map(line => !isNaN(line) && !isNaN(parseInt(line)) ? [+line] : line.split(' ').map(word => !isNaN(word) && !isNaN(parseInt(word)) ? +word : word))

            processCommands(input)


            expect(consoleLogSpy.mock.calls).toEqual(expected_output)
        });

        it('Test case 4', () => {
            const input = [
                'MOVE_IN ANDY',
                'MOVE_IN WOODY',
                'MOVE_IN BO',
                'SPEND 6000 ANDY WOODY BO',
                'SPEND 3000 WOODY ANDY',
                'SPEND 12000 BO ANDY WOODY',
                'DUES ANDY',
                'DUES WOODY',
            ]

            const expected_output = [
                'SUCCESS',
                'SUCCESS',
                'SUCCESS',
                'SUCCESS',
                'SUCCESS',
                'SUCCESS',
                'BO 1500',
                'WOODY 0',
                'BO 4500',
                'ANDY 0',
            ].map(line => !isNaN(line) && !isNaN(parseInt(line)) ? [+line] : line.split(' ').map(word => !isNaN(word) && !isNaN(parseInt(word)) ? +word : word))

            processCommands(input)


            expect(consoleLogSpy.mock.calls).toEqual(expected_output)
        });
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

            process.argv = ['node', 'script.js', 'sample_input/input1.txt'];

            main()
            expect(fs.readFile).toHaveBeenCalledWith('sample_input/input1.txt', 'utf8', expect.any(Function));
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
