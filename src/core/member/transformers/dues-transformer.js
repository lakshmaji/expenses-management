const { INITIAL_BALANCE } = require("../../../constants");

// These can be specific to protocol we use like io-cli / gRPC / REST etc
const transformDues = (dues) => {
    if (Array.isArray(dues) && dues.length > INITIAL_BALANCE) {
        return dues.map((element) => {
            return `${element.from} ${element.amount}`;
        });
    }
    return dues;
};

module.exports = transformDues;
