const { INITIAL_BALANCE, FILENAME_POSITION } = require("../src/constants");
const { HOUSEMATE_MESSAGES, CLEAR_DUE_MESSAGES, MOVE_OUT_MESSAGES } = require("../src/messages");
const expenses = require("./expenses.utils");

module.exports = [
    {
        "title": "Test case one",
        "input": [
            "MOVE_IN ANDY",
            "MOVE_IN WOODY",
            "MOVE_IN BO",
            "MOVE_IN REX",
            `SPEND ${expenses.cable_bill} ANDY WOODY BO`,
            `SPEND ${expenses.grocery_expenses} WOODY BO`,
            `SPEND ${expenses.grocery_expenses} WOODY REX`,
            "DUES BO",
            "DUES WOODY",
            `CLEAR_DUE BO ANDY ${expenses.library_bills}`,
            `CLEAR_DUE BO ANDY ${expenses.phone_bills}`,
            "MOVE_OUT ANDY",
            "MOVE_OUT WOODY",
            "MOVE_OUT BO",
            `CLEAR_DUE BO ANDY ${expenses.food_bills}`,
            "MOVE_OUT BO"
        ],
        "output": [
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS,
            "HOUSEFUL",
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND,
            `ANDY ${expenses.essentials_cost + (expenses.grocery_expenses / FILENAME_POSITION)}`,
            `WOODY ${INITIAL_BALANCE}`,
            `ANDY ${expenses.rent - expenses.food_bills}`,
            `BO ${INITIAL_BALANCE}`,
            `${expenses.food_bills}`,
            CLEAR_DUE_MESSAGES.INVALID_PAYMENT,
            MOVE_OUT_MESSAGES.FAILURE,
            MOVE_OUT_MESSAGES.FAILURE,
            MOVE_OUT_MESSAGES.FAILURE,
            `${INITIAL_BALANCE}`,
            HOUSEMATE_MESSAGES.SUCCESS
        ]
    },
    {
        "title": "Test case two",
        "input": [
            "MOVE_IN ANDY",
            "MOVE_IN WOODY",
            "MOVE_IN BO",
            `SPEND ${expenses.parties_bill} WOODY ANDY BO`,
            `SPEND ${expenses.parties_bill} ANDY BO`,
            "DUES ANDY",
            "DUES BO",
            `CLEAR_DUE BO ANDY ${expenses.essentials_cost}`,
            `CLEAR_DUE BO WOODY ${expenses.laundry_bill}`,
            "MOVE_OUT ANDY",
            "MOVE_OUT WOODY"
        ],
        "output": [
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS,
            `BO ${INITIAL_BALANCE}`,
            `WOODY ${INITIAL_BALANCE}`,
            `WOODY ${expenses.laundry_bill}`,
            `ANDY ${expenses.essentials_cost}`,
            `${INITIAL_BALANCE}`,
            `${INITIAL_BALANCE}`,
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS
        ]
    },
    {
        "title": "Test case three",
        "input": [
            `SPEND ${expenses.essentials_cost} WOODY ANDY`,
            "DUES ANDY",
            "MOVE_IN ANDY",
            `SPEND ${expenses.essentials_cost} ANDY REX`,
            "MOVE_OUT ANDY",
            `CLEAR_DUE ANDY WOODY ${expenses.library_bills}`,
        ],
        "output": [
            HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND,
            HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND,
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND,
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.MEMBER_NOT_FOUND
        ]
    },
    {
        "title": "Test case four",
        "input": [
            "MOVE_IN ANDY",
            "MOVE_IN WOODY",
            "MOVE_IN BO",
            `SPEND ${expenses.parties_bill} ANDY WOODY BO`,
            `SPEND ${expenses.cable_bill} WOODY ANDY`,
            `SPEND ${expenses.movies_bill} BO ANDY WOODY`,
            "DUES ANDY",
            "DUES WOODY"
        ],
        "output": [
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS,
            `BO ${expenses.rent}`,
            `WOODY ${INITIAL_BALANCE}`,
            `BO ${expenses.fuel_bills}`,
            `ANDY ${INITIAL_BALANCE}`,
        ]
    }
]