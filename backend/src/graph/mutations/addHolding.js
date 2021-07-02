
const { DateTime : Luxon , Settings : LuxonSettings } = require('luxon')
const assets = require('../../assets')


module.exports = {
    addHolding : {

        /*types : {
            AddHoldingResponse : `{
                status : String!
                reason : String
                holding : Holding!
            }`
        },*/

        mutation : `(
            name : String!
            ticker : String
            type : String!
            group : String
            region : String
            quantity : Float!
            buyUnitPrice : Float!
            buyTotalPrice : Float
            buyCurrency : String!
            buyDate : Date!
            fees : Float
        ) : HoldingMutationResponse`,

        resolver : resolver
        
    } 
}

function resolver (u, {holdingInput}) { 
    const Holding = require('../../models/Holding')

    holding = new Holding(holdingInput)

    let response = {}

    holding.save(function (err, holding) {
        if (err) {
            response.status = "ERROR"
            response.reason = "Could not save record"

            console.error(err);
            return response
        }


        console.log("Holding saved", holding);
        
        // fetch historical holding price data if there is none
        assets.loadAssetDataIfNeeded(holding.ticker, holding.type)

        // fetch exchange rate data if needed
        if (holding.buyCurrency != "USD") {
            assets.updateCurrencyExchangeDataIfNeeded(holding.buyCurrency, "USD", Luxon.local(),
                () => { console.log("fetched currency exchange data") },
                () => { console.log("error fetching currency exchange data") })
        }
        
        //respond
        return {
            status : "OK",
            holding : holding
        }
    });

}