
const { Luxon, LuxonSettings, stDateFormat } = require('../../../lib/luxon')
const assets = require('../../../lib/assets')
const Holding = require('../../../models/Holding')
const { roundDp } = require('../../../actions/functions')


//addHoldingMutation

module.exports = {
    addHolding : {
        types : {
            AddHoldingResponse : `{
                status : String!
                reason : String
                holding : Holding
            }`
        },
        format : "(holdingData : HoldingInput!) : AddHoldingResponse!",
        mutator : async (parentEntity, { holdingData }) => { 

            console.log("adding holding", holdingData)

            //console.log( "buy date", typeof holdingData.buyDate, holdingData.buyDate )

            try {

                if (holdingData.priceCurrency != holdingData.buyCurrency) {
                    
                    // get the exchange rate

                    let buyDate = Luxon.fromISO(holdingData.buyDate)
                    console.log( "buy date", holdingData.buyDate, buyDate )

                    let rate = await assets.getCurrencyExchangeRateUpdateIfNeededPromise(holdingData.priceCurrency, holdingData.buyCurrency, buyDate)
                    console.log( "rate", rate )
                    holdingData.buyUnitPrice = roundDp(holdingData.buyUnitPrice * rate, 2)
                    holdingData.buyTotalPrice = roundDp(holdingData.buyTotalPrice * rate, 2)
                }

                let holding = new Holding(holdingData)

                //console.log("adding holding 2", holding, typeof holding.buyUnitPrice, holding.buyUnitPrice)

                // save model to database
                try {
                    const result = await holding.save()

                    console.log("Holding saved", result, holding);
                    holding = holding.toObject()
                    //holding.id = holding._id
                    
                    //console.log("Holding id updated", holding);

                    // fetch historical holding price data if there is none
                    assets.loadAssetDataIfNeeded(holding.ticker, holding.type)

                    // fetch exchange rate data if needed
                    if ( holding.buyCurrency !== "USD" && holding.buyCurrency !== undefined ) {
                        try {
                            await assets.updateCurrencyExchangeDataIfNeededPromise(holding.buyCurrency, "USD", Luxon.local())
                            console.log("fetched currency exchange data")
                        } catch (e) {
                            console.log("error", e)
                        }
                    }
                    
                    const response = {
                        status : "OK",
                        holding : holding
                    }
                    console.log(response)
                    return response

                } catch (e) {
                    console.log("error:", e)
                    const response = {
                        status : "ERROR",
                        reason : "Could not save record"
                    }
                    console.log(response)
                    return response
                }

            } catch (e) {
                console.log("err: " + e)
            }

        },
    }
}