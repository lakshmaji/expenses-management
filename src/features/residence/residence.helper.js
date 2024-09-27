const Store = require('../../data/store');
const StoreMeta = require('../../core/store_meta');

class ResidenceHelper {
    constructor() {
        this.store=new Store()
        this.store_meta = new StoreMeta()
    }
    housemates  ()  {
        return this.store_meta.housemates()
    }
    house_full ()  {
        return this.store_meta.is_full()
    }
    occupants_count () {
        return this.store_meta.housemate_count()
    }
    
    getBalances () {
        return Object.fromEntries(this.store.get_balances())
    }
}

module.exports = ResidenceHelper