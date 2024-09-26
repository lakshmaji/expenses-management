const { createResidence } = require("./residence");

function commandParser(inputLines) {
    const home = createResidence();

    inputLines.forEach((line) => {
        const [command, ...args] = line.replace(/\r+$/, "").split(" ");

        switch (command) {
            case "MOVE_IN":
                const member_status = home.addMember(...args);
                console.log(member_status);
                break;
            case "SPEND":
                const spend_status = home.spend(...args);
                console.log(spend_status);
                break;
            case "CLEAR_DUE":
                const payment_status = home.clearDue(...args);
                console.log(payment_status);
                break;
            case "DUES":
                const dues_list = home.dues(...args);
                if (Array.isArray(dues_list)) {
                    dues_list.forEach((element) => {
                        console.log(element.from, element.amount);
                    });
                } else {
                    console.log(dues_list);
                }
                break;
            case "MOVE_OUT":
                const exit_status = home.moveOut(...args);
                console.log(exit_status);
                break;
            default:
                console.log("Unknown command");
        }
    });
}

module.exports = { commandParser };
