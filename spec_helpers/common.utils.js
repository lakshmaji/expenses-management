const Residence = require("../src/features/residence/residence");
const { FAKE_NAMES } = require("./constants");

const MEMBERS_LIST = Object.values(FAKE_NAMES);

const createResidence = () => new Residence();

const getOneHousemate = (users = MEMBERS_LIST) => users[Math.floor(Math.random() * users.length)];

const getRandomUser = () => getOneHousemate(MEMBERS_LIST);

const addNHousemates = (house, no_of_members) => {
	const members = new Set();
	while (house.occupants_count() < no_of_members && !house.house_full()) {
		const member = getRandomUser();
		members.add(member);
		house.addMember(member);
	}
	return Array.from(members);
};

function nonMember(members) {
	return MEMBERS_LIST.find((value) => !new Set(members).has(value)) ?? null;
}

const residence = (entities, cb) => entities.forEach((entity) => cb(entity)());

const addMembers = (house, members) => residence(members, m => house.addMember.bind(house, m))

const spendWithRoommates = (house, spends) => residence(spends, s => house.spend.bind(house, ...s))

const clearMemberDues = (house, payments) => residence(payments, p => house.clearDue.bind(house, ...p))

const isNumber = (word) => typeof Number(word) === "number" && !isNaN(parseInt(word));

module.exports = {
	nonMember,
	addNHousemates,
	getOneHousemate,
	addMembers,
	spendWithRoommates,
	clearMemberDues,
	isNumber,
	createResidence,
};
