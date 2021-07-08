
const { getExchangeRate, populateHolding } = require('../../../../lib/data')
const Holding = require('../../../../models/Holding')


module.exports = {
    getHoldings : {

        types : {
            GetHoldingsResponse : `{
                status : String
                reason : String
                holdings : [Holding]
                groups : [String]
                exchangeRates : [ExchangeRate]
            }`,
        },

        format : `(
            user : Int!
            displayCurrency : String!
            secondCurrency : String
        ) : GetHoldingsResponse`,

        resolver : async (parentEntity, {user, displayCurrency, secondCurrency}) => {
            
        
            //console.log("look for holdings", user)
        
            try {
                const holdings = await Holding.find({ user })/*.skip(0)*//*.limit(229)*/.exec()
                //console.log(holdings)
        
        
                // main currency exchange rates
                const currencies = [displayCurrency, secondCurrency]
                const exchangeRates = {}
                for (const currency of currencies) {
                    // skip USD, which we are using as de-facto base currency
                    if ( currency === undefined || currency === "USD" ) continue
            
                    //console.log("filling FX", c)
                    try {
                        exchangeRates[currency] = await getExchangeRate(displayCurrency, currency)
                    } catch(e) {
                        console.log(e)
                        return
                    }
                }
            
        
                // groups for the add holding form
                const groups = []
                for ( const holding of holdings ) {
                    if ( holding.group !== "" && ! groups.includes(holding.group) ) {
                        groups.push(holding.group)
                    }
        
                    await populateHolding(holding, displayCurrency, secondCurrency)
                }
        
        
                // respond

                const response = {
                    status : "OK",
                    reason : null,
                    holdings,
                    groups,
                    exchangeRates : (Object.keys(exchangeRates).length > 0)
                        ? Object.values(exchangeRates)
                        : null
                }

                //console.log(response)
        
                return response
            
            } catch(error) {
                console.log(error)
            }
        
        }

    }
}
