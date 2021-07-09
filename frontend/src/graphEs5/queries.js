
const types = require('./types')

// experimental, not in use

module.export = {

    getHoldings(userId, displayCurrency, secondCurrency) {
        return `query GetHoldings {
            getHoldings(
                user: ${userId}
                displayCurrency : "${displayCurrency}"
                secondCurrency : "${secondCurrency}"
            ) {
                status
                holdings ${types.Holding}
                groups
                exchangeRates ${types.ExchangeRate}
            }
        }`
    }

}

/*
The returned type:

HoldingsPackage : `{
    status : String
    reason : String
    holdings : [Holding]
    groups : [String]
    exchangeRates : [ExchangeRate]
}`,
*/