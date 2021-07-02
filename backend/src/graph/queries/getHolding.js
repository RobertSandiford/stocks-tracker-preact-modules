
const { DateTime : Luxon , Settings : LuxonSettings } = require('luxon')
const assets = require('../../lib/assets')

const { getHolding } = require('../../lib/data')

let getHoldingQuery = {}
getHoldingQuery.query = "(user : Int!, _id : ID!, displayCurrency : String!, secondCurrency : String) : Holding"
getHoldingQuery.resolver = async (parentEntity, {user, _id, displayCurrency, secondCurrency}) => {
    
    // main currency exchange rates
    let currencies = [displayCurrency, secondCurrency]
    let fx = {}
    for (const c of currencies) {
        if ( !c || c === "USD") continue // skip USD, which we are using as de-facto base currency

        console.log("filling FX", c)
        await fillFx(fx, displayCurrency, c)
    }

    return getHolding(user, _id, displayCurrency, secondCurrency)


}

module.exports = { getHolding : getHoldingQuery }