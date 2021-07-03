
//const addHoldingMutation = require('./mutations/addHolding.js')
//const addHoldingOpenMutation = require('../mutations/addHoldingOpen.js')
//const addHoldingCloseMutation = require('../mutations/addHoldingClose.js')

const assets = require('../lib/assets')

const Holding = require('../../models/Holding')

const entityName = "Holding"

const holdingDataType = `{
    name : String
    ticker : String
    exchangeName : String
    exchangeTicker : String
    type : String
    group : String
    region : String
    quantity : Float
    buyUnitPrice : Float
    buyTotalPrice : Float
    buyCurrency : String
    buyDate : Date
    buyRate : Float
    fees : Float
    currentUnitPrice : Float
    currentTotalPrice : Float
    priceCurrency : String
    currentPriceDate : Date
    currentRate : Float
    opens : [Open]
    closes : [Close]
}`

const holdingType = `{
    _id : ID!
    name : String
    ticker : String
    exchangeName : String
    exchangeTicker : String
    type : String
    group : String
    region : String
    quantity : Float
    buyUnitPrice : Float
    buyTotalPrice : Float
    buyCurrency : String
    buyDate : Date
    buyRate : Float
    fees : Float
    currentUnitPrice : Float
    currentTotalPrice : Float
    priceCurrency : String
    currentPriceDate : Date
    currentRate : Float
    opens : [Open]
    closes : [Close]
}`

const addHoldingMutation = {
    addHolding : {
        types : {
            AddHoldingResponse : `{
                status : String!
                reason : String
                holding : Holding
            }`
        },
        format : "(holdingData : HoldingData!) : AddHoldingResponse!",
        mutator : async (parentEntity, { holdingData }) => { 

            console.log("adding holding", holdingData)

            console.log( "buy date", typeof holdingData.buyDate, holdingData.buyDate )

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

                console.log("adding holding 2", holding, typeof holding.buyUnitPrice, holding.buyUnitPrice)

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
                    if (holding.buyCurrency != "USD") {
                        assets.updateCurrencyExchangeDataIfNeeded(holding.buyCurrency, "USD", Luxon.local(),
                            () => { console.log("fetched currency exchange data") },
                            () => { console.log("error fetching currency exchange data") })
                    }
                    
                    const response = {
                        status : "OK",
                        holding : holding
                    }
                    console.log(response)
                    return response

                } catch(e) {
                    console.log("error:", e)
                    const response = {
                        status : "ERROR",
                        reason : "Could not save record"
                    }
                    console.log(response)
                    return response
                }

            } catch(e) {
                console.log("err: " + e)
            }

        },
    }
}

const updateHoldingMutation = {
    updateHolding : {
        types : {
            RemoveHoldingResponse : `{
                status : String!
                reason : String
                holding : Holding
            }`
        },
        format : "(updatedHolding : Holding!) : UpdateHoldingResponse!",
        mutator : (parentEntity, updatedHolding) => { 

            console.log("updating holding")

            let currTime = Luxon.local().toISO();
            console.log("currTime", currTime)
            updatedHolding.currentPriceDate = currTime

            console.log("try update", updatedHolding)

            try {

                const holdingDocument = await Holding.findOneAndUpdate(
                    { _id : holding._id },
                    holding,
                    { new : true }
                ).lean()

                console.log(holdingDocument)
                    
                //respond
                const response = {
                    status : "OK",
                    holding : holdingDocument
                }
                console.log(response)
                return response

            } catch (e) {
                console.log("error: ", e)
                const response = {
                    status : "ERROR",
                    reason : "Could not update record"
                }
                console.log(response)
                return response
            }

        },
    }
}

const removeHoldingMutation = {
    removeHolding : {
        types : {
            RemoveHoldingResponse : `{
                status : String!
                reason : String
                holdingId : Number
            }`
        },
        format : "(_id : ID!) : RemoveHoldingResponse!",
        mutator : async (parentEntity, {_id}) => { 
        
            console.log("removing holding with id ", _id)

            if ( ! _id ) { console.log("exiting remove holding because _id is not set/valid"); return }
           
            // delete holding
            try {
                const filter = { _id : _id }
                const result = await Holding.deleteOne(filter)

                if (result.deletedCount === 0) {
                    const response = {
                        status : "NOOP",
                        reason : "No records deleted"
                    }
                    console.log("response: ", response)
                    return response
                }

                console.log("Holding deleted with id: " + _id);
                console.log("result: ", result)
                const response = {
                    status : "OK",
                    _id : _id
                }
                console.log("response: ", response)
                return response

            } catch (e) {
                console.log("Error trying to delete Holding: " + e)
                const response = {
                    status : "ERROR",
                    reason : "Could not delete record",
                    holdingId : _id
                }
                console.log("response:" + response)
                return response
            }

        }
    }
}

module.exports = {
    [entityName] : {
        types : {
            HoldingData : holdingDataType,
            Holding : holdingType
        },
        queries : {
            getHolding : {
                format : "(_id : ID!) : Holding!",
                resolver : (parentEntity, {_id}) => { 
                    const filter = { _id : _id }
                    return Holding.findOne(filter)
                },
            },
            getHoldings : {
                format : "(userId : ID!) : Holding!",
                resolver : (parentEntity, {userId}) => { 
                    const filter = { userId : userId }
                    return Holding.findMany(filter)
                },
            }
        },
        mutations : {
            ...addHoldingMutation,
            ...updateHoldingMutation,
            ...removeHoldingMutation
        }
        
    }
}