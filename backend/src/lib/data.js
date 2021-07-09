import { Luxon } from './luxon'
import * as assets from './assets'
import Holding from '../models/Holding'

/*
function goodBadPromise(f) {
    return new Promise( async (resolve, reject) => {
        try {
            const r = await f()
            resolve({ value : r })
        } catch (err) {
            resolve({ error : err })
        }
    })
}
*/


// changes the passed object
const fillFx = async (fx, toCurr, fromCurr) => {
    try {
        const rateData = await assets.getCurrencyExchangeRateUpdateIfNeededPromise(
            toCurr, fromCurr, Luxon.local())
       
        fx.toCurr = toCurr
        fx.fromCurr = fromCurr
        fx.date = Luxon.fromJSDate(rateData.date).toUTC()
        fx.rate = rateData.rate

    } catch(err) {
        console.log("error fetching currency exchange data", err)
    }
}


// changes the passed object
const getExchangeRate = async (toCurr, fromCurr) => {
    try {
        const rateData = await assets.getCurrencyExchangeRateUpdateIfNeededPromise(
            toCurr, fromCurr, Luxon.local())
       
        const fx = {
            toCurr,
            fromCurr,
            //date : Luxon.fromJSDate(rateData.date).toUTC(),
            date : rateData.date,
            rate : rateData.rate
        }

        return fx
    } catch(err) {
        console.log("error fetching currency exchange data", err)
        throw err
    }
}


// changes the passed object
const fillHoldingPrice = async (holding) => {

    // check if data is outdated, and fetch new data if needed
    await assets.updateAssetDataIfNeededPromise(holding.ticker, holding.type, holding.buyCurrency)

    const p = await assets.getLastPricePromise(holding.ticker, holding.priceCurrency)

    //console.log("got price for " + holding.ticker, p)

    if (p != null) {
        holding.currentUnitPrice = p.price
        holding.currentPriceDate = p.date
    }

    if (holding.ticker == "USD") holding.currentUnitPrice = holding.buyUnitPrice
}


const fillBuyRate = async (holding, displayCurrency) => {
    const date = Luxon.fromJSDate(holding.buyDate)
    try {
        const rateData = await assets.getCurrencyExchangeRateUpdateIfNeededPromise(
            displayCurrency, holding.buyCurrency, date)

        holding.buyRate = rateData.rate
    } catch(e) {
        console.log(e)
    }
}

const fillCurrentRate = async (holding, displayCurrency) => {
    const date = Luxon.local()
    try {
        const rateData = await assets.getCurrencyExchangeRateUpdateIfNeededPromise(
            displayCurrency, holding.priceCurrency, date)

        holding.currentRate = rateData.rate
        holding.currentRateDate = rateData.date
    } catch(e) {
        console.log(e)
    }
}


const getHolding = async (user, _id, displayCurrency, secondCurrency) => {
    try {
        //console.log("get the holding")
        const holding = await Holding.findOne({ user, _id }).lean().exec()
        populateHolding(holding, displayCurrency, secondCurrency)
        return holding
    } catch(error) {
        console.log(error)
    }
}


const populateHolding = async (holding, displayCurrency, secondCurrency) => {
    
    if ( ! displayCurrency ) return console.log("populateHolding error - no display currency passed in arg 2")

    try {
 
        // if it's not a custom holding, see if we can get the price
        if ( holding.type != "custom") {

            // populate the price
            await fillHoldingPrice(holding, displayCurrency, secondCurrency)
        }

        // get currency convertion for buy price
        if (holding.buyCurrency != displayCurrency) {
            //let buyDate = Luxon.fromJSDate(holding.buyDate)
            
            await fillBuyRate(holding, displayCurrency)
        }

        // get currency convertion for current price
        if (holding.priceCurrency != displayCurrency) {
            //let buyDate = Luxon.fromJSDate(holding.buyDate)

            await fillCurrentRate(holding, displayCurrency)
        }

        return holding
    
    } catch(error) {
        console.log(error)
    }

}
export { fillFx, getExchangeRate, getHolding, populateHolding }