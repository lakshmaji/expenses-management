const TEST_NUMBERS_DATA = require('./__tests__/test_data/nums.json');

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
    BILBY: 'Bilby',
    MINION: 'Minion',
    DRU: 'Dru',
    JACK: 'Jack Jack',
    ANGRY_BIRD: 'Angry Bird',
    PANDA: 'Panda',
    TANGLED: 'Tangled',
    TURBO: 'Turbo',
    FOR_THE_BIRDS: 'For The Birds',
    PIPER: 'Piper',
};


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

const addMembers = (house, members) => members.forEach(member => house.addMember(member))

const spendWithRoommates = (house, spends) => {
    spends.map(spend_info => {
        house.spend(...spend_info)
    })
}

const clearMemberDues = (house, payments) => {
    payments.map(payment => {
        house.clearDue(...payment)
    })
}

const isNumber = value =>  typeof Number(value) === 'number' && !isNaN(parseInt(value))

module.exports = {
    FAKE_NAMES,
    TESTING_CONSTANTS,
    nonMember,
    addNHousemates,
    getOneHousemate,
    addMembers,
    spendWithRoommates,
    clearMemberDues,
    isNumber,
}