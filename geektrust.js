const fs = require("fs")

const filename = process.argv[2]



fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const inputLines = data.toString().split('\n').filter(line => line.trim() !== '');
    processCommands(inputLines);
})


const createResidence = () => {
    const MAX_OCCUPANCY = 3;
    const HOUSEMATE_MESSAGES = {
        SUCCESS :'SUCCESS',
        HOUSEFUL :'HOUSEFUL',
        MEMBER_NOT_FOUND: 'MEMBER_NOT_FOUND',
    }
    
    const CLEAR_DUE_MESSAGES = {
        INVALID_PAYMENT : 'INCORRECT_PAYMENT'
    }

    const balances = new Map();

    const addMember = (name) => {
        if (balances.size >= MAX_OCCUPANCY) {
            return HOUSEMATE_MESSAGES.HOUSEFUL;
        }
        balances.set(name, 0);
        return HOUSEMATE_MESSAGES.SUCCESS;
    };

    const SPEND_MESSAGES = {
        SUCCESS: 'SUCCESS'
    }
    
    const spend = (amount, spent_by, ...on_members) => {
        if (balances.size < 2) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        const housemates = new Set(Array.from(balances.keys()).map(housemate => housemate.toLowerCase()));
        if (!housemates.has(spent_by.toLowerCase())) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
            
        }

        const valid_members = on_members.every(member => housemates.has(member.toLowerCase()));

        if (!valid_members) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
            
        }
    
    
        // Include spender
        const total_members = on_members.length + 1;
        const individual_share = amount / total_members;

        for (const member of on_members) {
            balances.set(spent_by, balances.get(spent_by) - individual_share);
            balances.set(member, balances.get(member) + individual_share);
        }
        return SPEND_MESSAGES.SUCCESS;
    };

    const settleDebts = () => {
        const transactions = [];

        const creditors = [];
        const debtors = [];

        for (const [member, balance] of balances) {
            if (balance > 0) {
                creditors.push({ member, amount: balance });
            } else if (balance < 0) {
                debtors.push({ member, amount: -balance });
            }
        }

        let i = 0, j = 0;

        while (i < creditors.length && j < debtors.length) {
            const creditor = creditors[i];
            const debtor = debtors[j];
            const amount = Math.min(creditor.amount, debtor.amount);

            transactions.push({
                from: debtor.member,
                to: creditor.member,
                amount
            });

            creditor.amount -= amount;
            debtor.amount -= amount;

            if (creditor.amount === 0) {
                i++;
            }
            if (debtor.amount === 0) {
                j++;
            }
        }

        return transactions;
    };

    function excluded_housemates(setA, setB) {
        const difference = new Set();
    
        setA.forEach(item => {
            if (!setB.has(item)) {
                difference.add(item);
            }
        });
    
        return difference;
    }
    const dues = (housemate) => {
        const housemates = new Set(Array.from(balances.keys()).map(housemate => housemate.toLowerCase()));
        if (!housemates.has(housemate.toLowerCase())) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }

        const transactions = settleDebts();

        const housemate_dues = transactions.filter(t => t.to === housemate)
        
        const current_housemates = new Set(housemate_dues.map(h => h.from).concat(housemate))
        const all_housemates = new Set(Array.from(balances.keys()))

        const diff = excluded_housemates(all_housemates, current_housemates)
        result = housemate_dues.concat(Array.from(diff, (e) => ({from: e, amount: 0})))
        
        result.sort((a, b) => {
            if (b.amount !== a.amount) {
                return b.amount - a.amount;
            }
            return a.from.localeCompare(b.from)
        })
        
    
        return result
        
    }

    const clearDue = (borrower, lender, amount) => {
        amount = parseInt(amount)
        const housemates = new Set(Array.from(balances.keys()).map(housemate => housemate.toLowerCase()));
        if (!housemates.has(borrower.toLowerCase())) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
    
        }
        if (!housemates.has(lender.toLowerCase())) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }
        
        // lender, amount
        // const existing_borrower_dues = DUES.get(borrower) || {}
        // if (existing_borrower_dues[lender] >= amount) {
        //     const updated_data = { ...existing_borrower_dues, ...({ [lender]: (existing_borrower_dues[lender] || 0) - amount}) }
        //     DUES.set(borrower ,updated_data)
        // } else {
        //     console.log(CLEAR_DUE_MESSAGES.INVALID_PAYMENT);
        //     return
        // }
    
        // console.log(DUES.get(borrower)[lender])

        const payerBalance = balances.get(borrower);
        const payeeBalance = balances.get(lender);
        // console.log(settleDebts(), borrower, lender)    

        if (payerBalance < amount) {
            return CLEAR_DUE_MESSAGES.INVALID_PAYMENT;
        }
        balances.set(borrower, payerBalance - amount);
        balances.set(lender, payeeBalance + amount);
        // return balances.get(borrower)
const ae =  settleDebts().filter(e => e.from === borrower).reduce((acc, v) => acc +v.amount, 0)    
const be =  settleDebts().filter(e => e.from === lender).reduce((acc, v) => acc +v.amount, 0)    
const ce =  settleDebts().filter(e => e.from === lender && e.to === borrower).reduce((acc, v) => acc +v.amount, 0)
// console.log(ce, borrower, lender)    
// // return be-ae
        // return balances.get(borrower)
        return ce
}

    const MOVE_OUT_MESSAGES = {
        FAILURE :'FAILURE',
        SUCCESS :'SUCCESS',
    }

    const canMoveOut = (member) => {
        const memberBalance = balances.get(member);

        // Check if member has any balance due (they should be at zero)
        if (memberBalance !== 0) {
            // return "FAILURE: Member has dues to clear.";
            return false
        }
        let result = true;

        for (const [otherMember, balance] of balances) {
            if (otherMember !== member && balance < 0) {
                const owedAmount = -balance; // Other member owes this amount
                if (balances.get(otherMember) > 0) {
                    result  = false;
                    break;

                }
                if (owedAmount !== 0) {
                    // result  = false;
                    // break;
                }
            }
        }

        return result
    };

      
    const moveOut = (member) => {
        const housemates = new Set(Array.from(balances.keys()).map(housemate => housemate.toLowerCase()));
        if (!housemates.has(member.toLowerCase())) {
            return HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND;
        }
        
        const result = canMoveOut(member);
        if (result) {
            balances.delete(member);
            return MOVE_OUT_MESSAGES.SUCCESS;
        } else {
            return MOVE_OUT_MESSAGES.FAILURE;
        }
    }

    return {
        addMember,
        spend,
        settleDebts,
        getBalances: () => Object.fromEntries(balances),
        dues,
        clearDue,
        moveOut,
    };
};


function processCommands(inputLines) {
    const home = createResidence();

    inputLines.forEach(line => {
        const [command, ...args] = line.replace(/\r+$/, '').split(' ');

        switch (command) {
            case 'MOVE_IN':
                const re = home.addMember(...args);
                console.log(re)
                break;
            case 'SPEND':
                const respend = home.spend(...args);
                console.log(respend)
                break;
            case 'CLEAR_DUE':
                const reclear =home.clearDue(...args);
                console.log(reclear)
                break;
            case 'DUES':
                const result = home.dues(...args);
                if (Array.isArray(result)) {
                    result.forEach(element => {
                        console.log(element.from, element.amount)
                    });
                } else {
                    console.log(result)
                }
                break;
            case 'MOVE_OUT':
                const remove = home.moveOut(...args);
                console.log(remove)
                break;
            default:
                console.log('Unknown command');
        }
        
    });
}
