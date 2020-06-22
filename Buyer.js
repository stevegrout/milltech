class Buyer {
    constructor(market) {
        this.market = market;
    }

    getBestPrice(product) {
        const quotes = this.market.sellers.map(seller => seller.quote(product));
        return Math.min(...quotes);
    }

    completelyFill(product, quantity) {
        let amountNeeded = quantity;
        let totalCost = 0;

        while (amountNeeded > 0) {
            const cheapestSeller = getCheapestSeller(this.market.sellers, product);
            const { boughtQuantity, cost } = cheapestSeller.sell(product, amountNeeded);
            amountNeeded -= boughtQuantity;
            totalCost += cost;
        }
        return totalCost;
    }

    quicklyFill(product, quantity) {
        const sellerWithAvailability = getCheapestSellerWithAvailability(this.market.sellers, product, quantity)
        if (!sellerWithAvailability) {
            throw new Error('no seller with availability for quick fill')
        }
        const { cost } = sellerWithAvailability.sell(product, quantity);
        return cost;
    }
}

const getCheapestSeller = (sellers, product) => {
    let cheapestSeller = undefined;
    let lowestPrice = undefined;

    const quotes = sellers.map(seller => { return { seller: seller, price: seller.quote(product) } });

    for (const quote of quotes) {
        if (!lowestPrice || quote.price < lowestPrice) {
            lowestPrice = quote.price;
            cheapestSeller = quote.seller;
        }
    }
    return cheapestSeller;
}

const getCheapestSellerWithAvailability = (sellers, product, quantity) => {
    const sellersWithAvailability = sellers.filter(seller => seller.inventory[product].quantity >= quantity);
    return getCheapestSeller(sellersWithAvailability, product);
}

module.exports = { Buyer }
