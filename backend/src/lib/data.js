
const { DateTime : Luxon, Settings : LuxonSettings } = require('luxon')
const assets = require('./assets')

const Holding = require('../models/Holding')


function goodBadPromise (f) {
    return new Promise( async (resolve, reject) => {
        try {
            const r = await f()
            resolve({ value : r })
        } catch (err) {
            resolve({ error : err })
        }
    })
}


// changes the passed object
const fillFx = async (fx, toCurr, fromCurr) => {
    try {
        const rateData = await assets.getCurrencyExchangeRateUpdateIfNeededPromise(toCurr, fromCurr, Luxon.local())
       
        fx.toCurr = toCurr
        fx.fromCurr = fromCurr
        fx.date = Luxon.fromJSDate(rateData.date).toUTC()
        fx.rate = rateData.rate

    } catch (err) {
        console.log("error fetching currency exchange data", err)
    }
}
module.exports.fillFx = fillFx


// changes the passed object
const fillHoldingPrice = async (holding) => {

    // check if data is outdated, and fetch new data if needed
    await assets.updateAssetDataIfNeededPromise(holding.ticker, holding.type, holding.buyCurrency)

    const p = await assets.getLastPricePromise(holding.ticker, holding.priceCurrency)

    console.log("got price for " + holding.ticker, p)

    if (p != null) {
        holding.currentUnitPrice = p.price
        holding.currentPriceDate = p.date
    }

    if (holding.ticker == "USD") holding.currentUnitPrice = holding.buyUnitPrice
}

const fillBuyRate = async (holding, displayCurrency) => {
    const date = Luxon.fromJSDate(holding.buyDate)
    const rateData = await goodBadPromise(
        () => assets.getCurrencyExchangeRateUpdateIfNeededPromise(displayCurrency, holding.buyCurrency, date)
    )
    console.log(rateData)
    if ( ! rateData.error ) holding.buyRate = rateData.value.rate
}

const fillCurrentRate = async (holding, displayCurrency) => {
    const date = Luxon.local()
    const rateData = await goodBadPromise(
        () => assets.getCurrencyExchangeRateUpdateIfNeededPromise(displayCurrency, holding.priceCurrency, date)
    )
    if ( ! rateData.error ) {
        console.log(rateData)
        holding.currentRate = rateData.value.rate
        holding.currentRateDate = rateData.value.date
    }
}


const getHolding = async (user, _id, displayCurrency, secondCurrency) => {
    try {
        console.log("get the holding")
        const holding = await Holding.findOne({ user, _id }).lean().exec()

        return module.exports.populateHolding(holding, displayCurrency, secondCurrency)
    } catch (error) {
        console.log(error)
    }
}
module.exports.getHolding = getHolding


const populateHolding = async (holding, displayCurrency, secondCurrency) => {
    
    if ( ! displayCurrency ) return console.log("populateHolding error - no display currency passed in arg 2")

    try {
 
        // if it's not a custom holding, see if we can get the price
        if ( holding.type != "custom") {

            console.log("holding 0", holding)
            // populate the price
            await fillHoldingPrice(holding, displayCurrency, secondCurrency)
            console.log("holding 1", holding)
        }

        console.log("currs", holding.buyCurrency, holding.priceCurrency, displayCurrency)


        // get currency convertion for buy price
        if (holding.buyCurrency != displayCurrency) {
            //let buyDate = Luxon.fromJSDate(holding.buyDate)

            console.log("get buy exchange rate", displayCurrency, holding.buyCurrency)
            await fillBuyRate(holding, displayCurrency)
        }

        // get currency convertion for current price
        if (holding.priceCurrency != displayCurrency) {
            //let buyDate = Luxon.fromJSDate(holding.buyDate)

            console.log("get price exchange rate", displayCurrency, holding.priceCurrency)
            await fillCurrentRate(holding, displayCurrency)
        }

        console.log("now respond", holding)
        return holding
    
    } catch (error) {
        console.log(error)
    }

}
module.exports.populateHolding = populateHolding