class CommandValidator {
    constructor(name) {
        this.name = name;
    }

    isValid() {
        return ["MOVE_IN", "SPEND", "CLEAR_DUE", "DUES", "MOVE_OUT"].includes(
            this.name
        );
    }
}

module.exports = CommandValidator;
