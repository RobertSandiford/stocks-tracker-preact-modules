
const { fillFx, populateHolding } = require('../../../../lib/data')
const Holding = require('../../../../models/Holding')


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
            
        
            //console.log("look for holdings", user)
        
            try {
                const holdings = await Holding.find({ user })/*.skip(0)*//*.limit(229)*/.exec()
                //console.log(holdings)
        
        
                // main currency exchange rates
                const currencies = [displayCurrency, secondCurrency]
                const fx = {}
                for (const c of currencies) {
                    if ( !c || c === "USD") continue // skip USD, which we are using as de-facto base currency
            
                    console.log("filling FX", c)
                    await fillFx(fx, displayCurrency, c)
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
                //console.log("responding", holdings.length, holdings)
                //console.log(typeof holdings[0].buyDate, holdings[0].buyDate)
        
                const response = {
                    status : "OK",
                    reason : null,
                    holdings,
                    groups,
                    fx : (Object.keys(fx).length > 0) ? fx : null
                }
        
                return response
            
            } catch (error) {
                console.log(error)
            }
        
        }

    }
}
