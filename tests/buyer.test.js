const rand = require('random-seed').create()
const { Buyer } = require('../Buyer')
const { Market } = require('../Market')
const { Seller } = require('../Seller')

const products = ["Apples", "Oranges", "Pears"]

const inventoryFactory = (price) => {
  return products.reduce((obj, item) => (obj[item] = {
    quantity: rand(100),
    price: price || +rand.floatBetween(1, 5).toFixed(2)
  }, obj) ,{});
}

const getAnyProduct = () => {
  return products[Math.floor(Math.random() * products.length)];
}

describe("Buyer", function(){
  const noOfSellers = 3;
  let sellers = [];
  let inventories = [];
  let market;

  beforeEach(() => {
    while (sellers.length < noOfSellers) {
      const inventory = inventoryFactory()
      inventories.push(inventory)
      sellers.push(new Seller(inventory))
    }
    market = new Market(sellers)
  })

  it("should return the lowest price for a product when I ask the market", () => {
    let buyer = new Buyer(market)
    const bestPrice = buyer.getBestPrice("Apples")

    expect(bestPrice).toEqual(Math.min(...inventories.map(inv => inv.Apples.price)))
  });

  it("should completely fill an order with the best price available", () => {
    const product = getAnyProduct();
    inventories[0][product].price = 0.5
    inventories[0][product].quantity = 10

    let buyer = new Buyer(market)
    const overallPrice = buyer.completelyFill(product, 10)

    expect(overallPrice).toEqual(5.00)
  });

  it("should quickly fill an order by using the cheapest seller with enough availability", () => {
    const product = getAnyProduct();
    inventories[0][product].price = 0.5
    inventories[0][product].quantity = 10
    inventories[1][product].price = 1.0
    inventories[1][product].quantity = 20
    inventories[2][product].price = 0.3
    inventories[2][product].quantity = 30

    let buyer = new Buyer(market)
    const overallPrice = buyer.quicklyFill(product, 15)

    expect(overallPrice).toEqual(4.5)
  });

  it("should throw an error if there are no sellers that have product available for the given quantity", () => {
    let buyer = new Buyer(market)
    expect(() => buyer.quicklyFill(getAnyProduct(), 150)).toThrow('no seller with availability for quick fill')
  })
})

