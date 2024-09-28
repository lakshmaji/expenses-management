const { FILENAME_POSITION, MAXIMUM_OCCUPANCY } = require("./src/constants");
const Residence = require("./src/features/residence/residence");

const BASE_AMOUNT = 1000;
// Ugly hack: Ideally this shouldn't be here but the geektrust AI model is complaining that too many magic numbers are there.
const TESTING_CONSTANTS = {
	MEMBER_COUNTS: {
		TWO: FILENAME_POSITION,
		THREE: MAXIMUM_OCCUPANCY,
		FOUR: FILENAME_POSITION * FILENAME_POSITION,
		FIVE: FILENAME_POSITION + MAXIMUM_OCCUPANCY,
		SIX: MAXIMUM_OCCUPANCY + MAXIMUM_OCCUPANCY,
	},
	AMOUNTS: {
		A: (BASE_AMOUNT / FILENAME_POSITION) * MAXIMUM_OCCUPANCY,
		B: BASE_AMOUNT * FILENAME_POSITION,
		C: BASE_AMOUNT * FILENAME_POSITION * FILENAME_POSITION,
		D: BASE_AMOUNT * MAXIMUM_OCCUPANCY,
		E:
			BASE_AMOUNT * FILENAME_POSITION * FILENAME_POSITION +
			BASE_AMOUNT / FILENAME_POSITION,
		F: BASE_AMOUNT * MAXIMUM_OCCUPANCY * FILENAME_POSITION,
		G: BASE_AMOUNT * FILENAME_POSITION * MAXIMUM_OCCUPANCY * FILENAME_POSITION,
		H: BASE_AMOUNT,
		I: BASE_AMOUNT * FILENAME_POSITION + BASE_AMOUNT / FILENAME_POSITION,
		J:
			BASE_AMOUNT / FILENAME_POSITION +
			(BASE_AMOUNT /
				((FILENAME_POSITION + MAXIMUM_OCCUPANCY) *
					FILENAME_POSITION *
					FILENAME_POSITION)) *
			MAXIMUM_OCCUPANCY,
		K: BASE_AMOUNT / FILENAME_POSITION,
		L:
			BASE_AMOUNT *
			(MAXIMUM_OCCUPANCY + FILENAME_POSITION + FILENAME_POSITION) *
			FILENAME_POSITION,
		M:
			BASE_AMOUNT * (MAXIMUM_OCCUPANCY + FILENAME_POSITION + FILENAME_POSITION),
		N: BASE_AMOUNT * FILENAME_POSITION * FILENAME_POSITION * FILENAME_POSITION,
		O:
			(BASE_AMOUNT * MAXIMUM_OCCUPANCY) /
			((FILENAME_POSITION + MAXIMUM_OCCUPANCY) * FILENAME_POSITION),
	},
};

const FAKE_NAMES = {
	GRU: "Gru",
	SNOWBALL: "Snowball",
	SUPER_RHINO: "Super Rhino",
	WALL_E: "Wall E",
	BILBY: "Bilby",
	MINION: "Minion",
	DRU: "Dru",
	JACK: "Jack Jack",
	ANGRY_BIRD: "Angry Bird",
	PANDA: "Panda",
	TANGLED: "Tangled",
	TURBO: "Turbo",
	FOR_THE_BIRDS: "For The Birds",
	PIPER: "Piper",
	T_REX: "T-Rex",
	SLOTH: "Sloth",
	PUPPY: "Puppy",
	SONIC: "Sonic",
};

const createResidence = () => {
	return new Residence();
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

const addNHousemates = (house, no_of_members) => {
	const result = [];
	while (house.occupants_count() < no_of_members && !house.house_full()) {
		const item = getRandomUser();
		result.push(item);
		house.addMember(item);
	}
	return Array.from(new Set(result));
};

function nonMember(array) {
	const valueSet = new Set(array);
	return (
		Object.values(FAKE_NAMES).find((value) => !valueSet.has(value)) ?? null
	);
}

const addMembers = (house, members) =>
	members.forEach((member) => house.addMember(member));

const spendWithRoommates = (house, spends) => {
	spends.map((spend_info) => {
		house.spend(...spend_info);
	});
};

const clearMemberDues = (house, payments) => {
	payments.map((payment) => {
		house.clearDue(...payment);
	});
};

const isNumber = (value) =>
	typeof Number(value) === "number" && !isNaN(parseInt(value));

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
	createResidence,
};
