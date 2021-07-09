
import { Luxon } from '../../../../lib/luxon'
import * as assets from '../../../../lib/assets'
import { roundDp } from '../../../../lib/functions'
import Holding from '../../../../models/Holding'


//addHoldingMutation

export default {
    addHolding : {
        types : {
            AddHoldingResponse : `{
                status : String!
                reason : String
                holding : Holding
            }`
        },
        format : "(holdingInput : HoldingInput!) : AddHoldingResponse!",
        mutator : async (parentEntity, { holdingInput }) => {

            //console.log("adding holding", holdingInput)

            //console.log( "buy date", typeof holdingInput.buyDate, holdingInput.buyDate )

            try {

                if (holdingInput.priceCurrency != holdingInput.buyCurrency) {
                    
                    // get the exchange rate

                    const buyDate = Luxon.fromISO(holdingInput.buyDate)
                    //console.log( "buy date", holdingInput.buyDate, buyDate )

                    const rate = await assets.getCurrencyExchangeRateUpdateIfNeededPromise(
                        holdingInput.priceCurrency, holdingInput.buyCurrency, buyDate)
                    //console.log( "rate", rate )
                    holdingInput.buyUnitPrice = roundDp(holdingInput.buyUnitPrice * rate, 2)
                    holdingInput.buyTotalPrice = roundDp(holdingInput.buyTotalPrice * rate, 2)
                }

                let holding = new Holding(holdingInput)

                //console.log("adding holding 2", holding, typeof holding.buyUnitPrice, holding.buyUnitPrice)

                // save model to database
                try {
                    const result = await holding.save()

                    //console.log("Holding saved", result, holding)
                    holding = holding.toObject()
                    //holding.id = holding._id
                    
                    //console.log("Holding id updated", holding);

                    // fetch historical holding price data if there is none
                    assets.loadAssetDataIfNeeded(holding.ticker, holding.type)

                    // fetch exchange rate data if needed
                    if ( holding.buyCurrency !== "USD" && holding.buyCurrency !== undefined ) {
                        try {
                            await assets.updateCurrencyExchangeDataIfNeededPromise(
                                holding.buyCurrency, "USD", Luxon.local())
                            //console.log("fetched currency exchange data")
                        } catch(e) {
                            console.log("error", e)
                        }
                    }
                    
                    const response = {
                        status : "OK",
                        holding
                    }
                    //console.log(response)
                    return response

                } catch(e) {
                    console.log("error:", e)
                    const response = {
                        status : "ERROR",
                        reason : "Could not save record"
                    }
                    //console.log(response)
                    return response
                }

            } catch(e) {
                console.log("err: " + e)
            }

        },
    }
}