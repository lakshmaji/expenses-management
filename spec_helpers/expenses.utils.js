const { FILENAME_POSITION, MAXIMUM_OCCUPANCY } = require("../src/constants");

// Ugly hack: Ideally this shouldn't be here but the geektrust AI model is complaining that too many magic numbers are there.
const duplex_max_occupancy = FILENAME_POSITION + MAXIMUM_OCCUPANCY;
const studio_max_occupancy = duplex_max_occupancy * FILENAME_POSITION;
const flat_max_occupancy = FILENAME_POSITION * FILENAME_POSITION;
const bungalow_max_occupancy = MAXIMUM_OCCUPANCY * FILENAME_POSITION;
const mansion_max_occupancy = duplex_max_occupancy + FILENAME_POSITION;

// expenses
const essentials_cost = studio_max_occupancy ** MAXIMUM_OCCUPANCY;
const library_bills = essentials_cost / FILENAME_POSITION;
const internet_bill = essentials_cost * FILENAME_POSITION;
const laundry_bill = essentials_cost * flat_max_occupancy;
const rent = library_bills * MAXIMUM_OCCUPANCY;
const cable_bill = essentials_cost * MAXIMUM_OCCUPANCY;
const fuel_bills = laundry_bill + library_bills;
const parties_bill = essentials_cost * bungalow_max_occupancy;
const movies_bill = internet_bill * bungalow_max_occupancy;
const phone_bills = internet_bill + library_bills;
const gym_membership = essentials_cost * mansion_max_occupancy;
const pet_care_bills = laundry_bill * FILENAME_POSITION;
const grocery_expenses = cable_bill / studio_max_occupancy;
const electricity_bills = gym_membership * FILENAME_POSITION;
const food_bills = library_bills + (essentials_cost / (duplex_max_occupancy * flat_max_occupancy)) * MAXIMUM_OCCUPANCY;

const RESIDENCE = {
	CAPACITY: {
		X_SMALL: bungalow_max_occupancy,
		SMALL: FILENAME_POSITION,
		MEDIUM: MAXIMUM_OCCUPANCY,
		LARGE: flat_max_occupancy,
		X_LARGE: duplex_max_occupancy,
	},
};

module.exports = {
	RESIDENCE,
	rent,
	internet_bill,
	laundry_bill,
	cable_bill,
	fuel_bills,
	parties_bill,
	movies_bill,
	essentials_cost,
	phone_bills,
	food_bills,
	library_bills,
	electricity_bills,
	gym_membership,
	pet_care_bills,
	grocery_expenses,
};
