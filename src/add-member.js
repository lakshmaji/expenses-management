const Member = require("./member");

const addMember = (name) => {
    const member = new Member();
    return member.addMember(name)
};

module.exports = { addMember }