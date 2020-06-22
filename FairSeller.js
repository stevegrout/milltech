const { Seller } = require('./Seller')

class FairSeller extends Seller {
  constructor(inventory, id, deliveryWait) {
    super(inventory, id, deliveryWait)
  }

  calculatePriceChange(product) {
    return 0;
  }
}

module.exports = {FairSeller}