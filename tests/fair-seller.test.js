const { FairSeller } = require('../FairSeller')


describe('FiarSeller ', () => {
  const inventory = {
    "Apples":{
      quantity:100,
      price:5.25
    },
    "Oranges":{
      quantity:150,
      price:8.0
    },
    "Pears":{
      quantity:10,
      price:15.0
    }
  }

  it("should keep the same prices after a sale", () => {
    let sut = new FairSeller(inventory, "FairPlace");
    sut.sell("Oranges", sut.inventory["Oranges"].quantity/2);
    expect(sut.inventory["Oranges"].price).toBe(8.0);
  });
})
