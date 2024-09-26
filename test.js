const { faker } = require('@faker-js/faker');

const { createResidence } = require('./geektrust');

// TODO: move to Jest setup
// expect.extend({
//     toHaveChanged(received, fromValue, toValue) {
//         const isChanged = Object.keys(toValue).every(key => 
//             JSON.stringify(received[key]) === JSON.stringify(toValue[key])
//         );

//         const isFromValue = Object.keys(fromValue).every(key => 
//             JSON.stringify(received[key]) === JSON.stringify(fromValue[key])
//         );

//         const pass = isChanged && !isFromValue;

//         const message = pass
//             ? () => `expected ${JSON.stringify(received)} not to have changed from ${JSON.stringify(fromValue)} to ${JSON.stringify(toValue)}`
//             : () => `expected ${JSON.stringify(received)} to have changed from ${JSON.stringify(fromValue)} to ${JSON.stringify(toValue)}`;
        
//         return { message, pass };
//     },
// });


expect.extend({
    toHaveChanged(received, fromValue, toValue) {
            const hasDifference = Object.keys(toValue).every(key => {
                return JSON.stringify(received[key]) === JSON.stringify(toValue[key]) &&
                    JSON.stringify(fromValue[key]) !== JSON.stringify(received[key]);
            });
    
            const allKeysMatch = Object.keys(toValue).every(key => 
                received.hasOwnProperty(key)
            );
    
            const totalFromValue = {...fromValue, ...toValue};
    
            const matched_result= JSON.stringify(totalFromValue) === JSON.stringify(received)
    
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
        SNOWBALL:'Snowball',
        SUPER_RHINO: 'Super Rhino', 
        WALL_E: 'Wall E', 
    }

    function getRandomValue (arr) {
        const randomIndex = faker.number.int({ min: 0, max: arr.length - 1 });
        return arr[randomIndex];
    }

    function getOneHousemate (arr) {
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

    function getKeyByValue(value) {
        const obj = FAKE_NAMES
        for (const key in obj) {
            if (obj[key] === value) {
                return key;
            }
        }
        return null;
    }

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
                addNHousemates(house, 2)
                // house.addMember(FAKE_NAMES.SNOWBALL)
                // house.addMember(FAKE_NAMES.SUPER_RHINO)
                expect(house.occupants_count()).toBe(2)
            });

            it('should have 3 housemates', () => {
                const house = createResidence();
                // house.addMember(FAKE_NAMES.SNOWBALL)
                // house.addMember(FAKE_NAMES.WALL_E)
                // house.addMember(FAKE_NAMES.SUPER_RHINO)
                addNHousemates(house, 3)
                expect(house.occupants_count()).toBe(3)
            });

            it('should have 3 housemates', () => {
                const house = createResidence();
                // house.addMember(FAKE_NAMES.SNOWBALL)
                // house.addMember(FAKE_NAMES.WALL_E)
                // house.addMember(FAKE_NAMES.SUPER_RHINO)
                // house.addMember(FAKE_NAMES.GRU)
                addNHousemates(house, 4)
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
                // house.addMember(FAKE_NAMES.SNOWBALL)
                // house.addMember(FAKE_NAMES.SUPER_RHINO)
                addNHousemates(house, 2)
                expect(house.house_full()).toBe(false)
            });

            it('should return true when house is full', () => {
                const house = createResidence();
                // house.addMember(FAKE_NAMES.SNOWBALL)
                // house.addMember(FAKE_NAMES.WALL_E)
                // house.addMember(FAKE_NAMES.SUPER_RHINO)
                addNHousemates(house, 3)
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
                // house.addMember(FAKE_NAMES.SNOWBALL)
                // house.addMember(FAKE_NAMES.SUPER_RHINO)
                const members = addNHousemates(house, 2)
                expect(house.housemates()).toEqual(members)
            });

            it('should return housemates list house is full', () => {
                const house = createResidence();
                const members = addNHousemates(house, 3)

                // house.addMember(FAKE_NAMES.SNOWBALL)
                // house.addMember(FAKE_NAMES.WALL_E)
                // house.addMember(FAKE_NAMES.SUPER_RHINO)
                // expect(house.housemates()).toEqual([FAKE_NAMES.SNOWBALL, FAKE_NAMES.WALL_E, FAKE_NAMES.SUPER_RHINO])
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
                // expect(previous_balances).toEqual({
                //     [FAKE_NAMES.SNOWBALL]: -1000,
                //     [FAKE_NAMES.SUPER_RHINO]: -4000,
                //     [FAKE_NAMES.WALL_E]: 5000,
                // })
                house.clearDue(FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, 1000)
                // expect(house.getBalances()).toEqual({
                //     [FAKE_NAMES.SNOWBALL]: 0,
                //     [FAKE_NAMES.SUPER_RHINO]: -4000,
                //     [FAKE_NAMES.WALL_E]: 4000,
                // })
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
                    {from :FAKE_NAMES.WALL_E, to: FAKE_NAMES.SNOWBALL, amount: 4500},
                    {from :FAKE_NAMES.WALL_E, to: FAKE_NAMES.SUPER_RHINO, amount: 1500},
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
                const expected_total = Object.values(balances).reduce((total, balance) => balance>0?total + balance:total, 0) 
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
                        {"amount": 1000, "from": FAKE_NAMES.SNOWBALL, "to": FAKE_NAMES.WALL_E}, 
                        {"amount": 4000, "from": FAKE_NAMES.SUPER_RHINO, "to": FAKE_NAMES.WALL_E}]

                )
                house.clearDue(FAKE_NAMES.WALL_E, FAKE_NAMES.SNOWBALL, 1000)
                expect(house.settleDebts()).toEqual([
                    {"from":FAKE_NAMES.SUPER_RHINO,"to":FAKE_NAMES.WALL_E,"amount":4000}
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
            addNHousemates(house, 2)
            const result = house.addMember(FAKE_NAMES.SUPER_RHINO)
            expect(result).toBe('SUCCESS')
        });

        it('should not welcome a new member to house when houseful', () => {
            const house = createResidence();
            addNHousemates(house, 3)
            const result = house.addMember(FAKE_NAMES.SUPER_RHINO)
            expect(result).toBe('HOUSEFUL')
        });
    })

    describe('SPEND', () => {
        it('should spend when added spent amount on all housemates', () => {
            const house = createResidence();
            const members = addNHousemates(house, 3)
            const result = house.spend(3000, ...members)
            expect(result).toBe('SUCCESS')
        });

        it('should spend when added spent amount on few housemates', () => {
            const house = createResidence();
            const members = addNHousemates(house, 3)
            const result = house.spend(3000, ...members.slice(0, 2))
            expect(result).toBe('SUCCESS')
        });

        it('should not spend when added spent amount on a new member', () => {
            const house = createResidence();
            const members = addNHousemates(house, 2)
            const result = house.spend(3000, ...members, findFirstMissingValue(members))
            expect(result).toBe('MEMBER_NOT_FOUND')
        });

        it('should not spend when added spent amount by a new member', () => {
            const house = createResidence();
            const members = addNHousemates(house, 2)
            const result = house.spend(3000, findFirstMissingValue(members), ...members, )
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
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SUPER_RHINO)
            house.spend(2000, FAKE_NAMES.GRU, FAKE_NAMES.SNOWBALL)
            house.spend(3000, FAKE_NAMES.SUPER_RHINO, FAKE_NAMES.SNOWBALL)
            const result = house.dues(FAKE_NAMES.SNOWBALL)
            expect(result).toEqual([{
                amount: 1500,
                from: FAKE_NAMES.SUPER_RHINO,
                to: FAKE_NAMES.SNOWBALL,
            }, {
                amount: 1000,
                from: FAKE_NAMES.GRU,
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

        it('should not accept amount when not a member of house', () => {
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
            const members = addNHousemates(house, 3)
            const result = house.moveOut(getOneHousemate(members))
            expect(result).toBe('SUCCESS')
        });

        it('should not move out when trying to move a non member of the house', () => {
            const house = createResidence();
            const members = addNHousemates(house, 2)
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

        it('should not move out when trying to move a member who owes by others', () => {
            const house = createResidence();
            house.addMember(FAKE_NAMES.GRU)
            house.addMember(FAKE_NAMES.SNOWBALL)
            house.spend(3000, FAKE_NAMES.SNOWBALL, FAKE_NAMES.GRU)
            const result = house.moveOut(FAKE_NAMES.SNOWBALL)
            expect(result).toBe('FAILURE')
        });
    })
});