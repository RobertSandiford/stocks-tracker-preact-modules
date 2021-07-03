
const { fillFx, populateHolding } = require('../../../lib/data')

module.exports = {
    getHoldings : {

        types : {
            GetHoldingsResponse : `{
                status : String
                reason : String
                holdings : [Holding]
                groups : [String]
                fx : Fx
            }`,
        },

        format : `(
            user : Int!,
            displayCurrency : String!,
            secondCurrency : String
        ) : GetHoldingsResponse`,

        resolver : async (parentEntity, {user, displayCurrency, secondCurrency}) => {
            const Holding = require('../../models/Holding')
        
            console.log("look for holdings", user)
        
            try {
                let holdings = await Holding.find({ user : user })/*.skip(0)*//*.limit(229)*/.exec()
                console.log(holdings)
        
        
                // main currency exchange rates
                let currencies = [displayCurrency, secondCurrency]
                let fx = {}
                for (const c of currencies) {
                    if ( !c || c === "USD") continue // skip USD, which we are using as de-facto base currency
            
                    console.log("filling FX", c)
                    await fillFx(fx, displayCurrency, c)
                }
            
        
                // groups for the add holding form
                let groups = []
                for (const [i, holding] of holdings.entries()) {
                    if ( holding.group !== "" && ! groups.includes(holding.group) ) {
                        groups.push(holding.group)
                    }
        
                    await populateHolding(holding, displayCurrency, secondCurrency)
                }
        
        
                // respond
                console.log("responding", holdings.length, holdings)
                console.log(typeof holdings[0].buyDate, holdings[0].buyDate)
        
                response = {
                    status : "OK",
                    reason : null,
                    holdings : holdings,
                    groups : groups,
                    fx : (Object.keys(fx).length > 0) ? fx : null
                }
        
                return response
            
            } catch(error) {
                console.log(error)
            }
        
        }

    }
}
