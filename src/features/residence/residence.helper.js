const StoreMeta = require("../../core/store_meta");

class ResidenceHelper {
    constructor() {
        this.store_meta = new StoreMeta();
    }
    housemates() {
        return this.store_meta.housemates();
    }
    house_full() {
        return this.store_meta.is_full();
    }
    occupants_count() {
        return this.store_meta.housemate_count();
    }
}

module.exports = ResidenceHelper;
