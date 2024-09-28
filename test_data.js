const { INITIAL_BALANCE, FILENAME_POSITION } = require("./src/constants");
const { HOUSEMATE_MESSAGES, CLEAR_DUE_MESSAGES, MOVE_OUT_MESSAGES } = require("./src/messages");
const { TESTING_CONSTANTS } = require("./test.helpers");

module.exports = [
    {
        "title": "Test case one",
        "input": [
            "MOVE_IN ANDY",
            "MOVE_IN WOODY",
            "MOVE_IN BO",
            "MOVE_IN REX",
            `SPEND ${TESTING_CONSTANTS.AMOUNTS.D} ANDY WOODY BO`,
            `SPEND ${TESTING_CONSTANTS.AMOUNTS.O} WOODY BO`,
            `SPEND ${TESTING_CONSTANTS.AMOUNTS.O} WOODY REX`,
            "DUES BO",
            "DUES WOODY",
            `CLEAR_DUE BO ANDY ${TESTING_CONSTANTS.AMOUNTS.K}`,
            `CLEAR_DUE BO ANDY ${TESTING_CONSTANTS.AMOUNTS.I}`,
            "MOVE_OUT ANDY",
            "MOVE_OUT WOODY",
            "MOVE_OUT BO",
            `CLEAR_DUE BO ANDY ${TESTING_CONSTANTS.AMOUNTS.J}`,
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
            `ANDY ${TESTING_CONSTANTS.AMOUNTS.H + (TESTING_CONSTANTS.AMOUNTS.O / FILENAME_POSITION)}`,
            `WOODY ${INITIAL_BALANCE}`,
            `ANDY ${TESTING_CONSTANTS.AMOUNTS.A - TESTING_CONSTANTS.AMOUNTS.J}`,
            `BO ${INITIAL_BALANCE}`,
            `${TESTING_CONSTANTS.AMOUNTS.J}`,
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
            `SPEND ${TESTING_CONSTANTS.AMOUNTS.F} WOODY ANDY BO`,
            `SPEND ${TESTING_CONSTANTS.AMOUNTS.F} ANDY BO`,
            "DUES ANDY",
            "DUES BO",
            `CLEAR_DUE BO ANDY ${TESTING_CONSTANTS.AMOUNTS.H}`,
            `CLEAR_DUE BO WOODY ${TESTING_CONSTANTS.AMOUNTS.C}`,
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
            `WOODY ${TESTING_CONSTANTS.AMOUNTS.C}`,
            `ANDY ${TESTING_CONSTANTS.AMOUNTS.H}`,
            `${INITIAL_BALANCE}`,
            `${INITIAL_BALANCE}`,
            HOUSEMATE_MESSAGES.SUCCESS,
            HOUSEMATE_MESSAGES.SUCCESS
        ]
    },
    {
        "title": "Test case three",
        "input": [
            `SPEND ${TESTING_CONSTANTS.AMOUNTS.H} WOODY ANDY`,
            "DUES ANDY",
            "MOVE_IN ANDY",
            `SPEND ${TESTING_CONSTANTS.AMOUNTS.H} ANDY REX`,
            "MOVE_OUT ANDY",
            `CLEAR_DUE ANDY WOODY ${TESTING_CONSTANTS.AMOUNTS.K}`,
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
            `SPEND ${TESTING_CONSTANTS.AMOUNTS.F} ANDY WOODY BO`,
            `SPEND ${TESTING_CONSTANTS.AMOUNTS.D} WOODY ANDY`,
            `SPEND ${TESTING_CONSTANTS.AMOUNTS.G} BO ANDY WOODY`,
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
            `BO ${TESTING_CONSTANTS.AMOUNTS.A}`,
            `WOODY ${INITIAL_BALANCE}`,
            `BO ${TESTING_CONSTANTS.AMOUNTS.E}`,
            `ANDY ${INITIAL_BALANCE}`,
        ]
    }
]