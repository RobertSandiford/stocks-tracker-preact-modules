import dotenv from 'dotenv'
dotenv.config()

import fetch from 'node-fetch'

const alphaconfig = { key: process.env.av_api_key }
import alphaFactory from 'alphavantage'
const alpha = alphaFactory({ key: alphaconfig.key })
import { DateTime as Luxon, Settings as LuxonSettings } from 'luxon'
LuxonSettings.defaultLocale = "en-GB"
//const stDateFormat = Object.assign(Luxon.DATE_MED, { })

import * as funcs from './apiFuncs'
import Asset from '../models/Asset'
import AssetData from '../models/AssetData'
import CurrencyExchange from '../models/CurrencyExchange'

//import Util from './util';
//const Util = require('alphavantage/lib/util')
//const util = Util(config);

//alpha.forex.dailyFull = (from_symbol, to_symbol, outputsize) => {
//    util.fn('FX_DAILY')({ from_symbol, to_symbol, outputsize })
//}

alphaconfig.base = `https://www.alphavantage.co/query?apikey=${alphaconfig.key}&`
const alphaurl = (params) => {
    params = Object.keys(params || {})
        .map((type) => {
            const value = params[type]
            if (value !== undefined) {
                return `${type}=${value}`
            }

            return undefined
        })
        .filter((value) => value !== undefined)
        .join('&')

    return `${alphaconfig.base}${params}`
}

const alphafn = (type) => (params) =>
    fetch(alphaurl(Object.assign({}, params, { function: type })))
        .then((res) => {
            if (res.status !== 200) {
                throw new Error(`An AlphaVantage error occurred. ${res.status}: ${res.text()}`)
            }

            return res.json()
        })
        .then((data) => {
            if (
                data['Meta Data'] === undefined
                && data['Realtime Currency Exchange Rate'] === undefined
                && data['Global Quote'] === undefined
                && data['bestMatches'] === undefined
                && data['Symbol'] === undefined
                && data['symbol'] === undefined
            ) {
                throw new Error(`An AlphaVantage error occurred. ${data['Information'] || JSON.stringify(data)}`)
            }

            return data
        })

alpha.forex.dailyExt = (fromSymbol, toSymbol, outputsize) => {
    return alphafn('FX_DAILY')({ fromSymbol, toSymbol, outputsize })
}



export const getCurrentPrice = async function (ticker, success, failure) {
    
    try {
        const data = await alpha.data.intraday(ticker, "compact", "json")
        
        const pData = alpha.util.polish(data)

        const key = Object.keys(pData.data)[0]
        const entry = pData.data[key]

        success(entry.close)
        return entry.close
    } catch(error) {
        console.log(error)
        failure(error)
    }
}

export const getLastAdjustedPrice = async function (ticker) {
    ticker = ticker.toUpperCase()

    try {
        const data = await AssetData.findOne({ ticker }).sort({ date : "desc" }).exec()
        return data
    } catch(err) {
        console.log(err)
    }
}

export const updateAssetDataIfNeeded = function (ticker) {
    ticker = ticker.toUpperCase()

    getDateOfLastPriceData(ticker, async (date) => {
        date = Luxon.fromJSDate(date)

        const now = Luxon.local()

        if ( now > date.plus({ days : 1, hours : 21 }) ) {

            // Today is at least 2 days after the last price
            // So there should definitely be new data to grab

            // X----Today is at least 1 day after the last price
            // X----(although we may not have prices yet for today,
            // X----but we will check anyway)
            console.log("Let's fetch new price data for " + ticker)

            await updateAssetDataPromise(ticker, date)
        }
        //Luxon.local()
    })

}

export const getDateOfLastPriceData = async function (ticker, success, failure) {
    ticker = ticker.toUpperCase()

    try {
        const data = await AssetData.findOne({ ticker }, null, { sort: { date : "desc" } })
    
        //console.log(ticker, "lastdate: find one data", data)
        let returnDate
        if (data != null) {
            returnDate = data.date
        } else {
            returnDate = new Date("1970-01-01T00:00:00Z")
        }

        funcs.callFuncIfExists(success, returnDate)
        return returnDate

    } catch(e) {
        console.log(e)
        funcs.callFuncIfExists(failure, e)
    }

}

export const doWeHaveAssetData = function (ticker, success) {
    ticker = ticker.toUpperCase()


    AssetData.findOne({ ticker }, (err, assetData) => {
        if (err) { console.log(err); return }

        //console.log(typeof AssetData, AssetData)

        //console.log(assetData)

        if (assetData != null) {
            success(true)
        } else success(false)
    })
}

export const createAsset = function (asset, success, failure) {

    console.log("Create Asset", asset)
    asset.ticker = asset.ticker.toUpperCase()


    new Asset(asset)
    .save((err, createdAsset) => {
        if (err) {
            console.log(err)
            funcs.callFuncIfExists(failure, err)
        } else {
            console.log("Asset created: ", createdAsset)
            funcs.callFuncIfExists(success, createdAsset)
        }
    })

}

export const assetExists = function (ticker, success) {
    ticker = ticker.toUpperCase()


    Asset.findOne({ ticker }, (err, asset) => {
        if (err) { console.log(err); return }

        if (asset != null) success(true)
        else success(false)
    })

}

export const loadAssetData = function (ticker, success, failure) {
    ticker = ticker.toUpperCase()

    console.log("==look for asset data==")

    loadStockData(ticker, () => { // success
        console.log("found asset data as stock")
        funcs.callFuncIfExists(success, "stock")
    }, () => {
        console.log("didn't find asset data as a stock")
        loadCryptoData(ticker, () => {
            console.log("found asset data as crypto")
            funcs.callFuncIfExists(success, "crypto")
        }, () => {
            console.log("didn't find asset data as a crypto")
            loadCurrencyData(ticker, () => {
                console.log("found asset data as currency")
                funcs.callFuncIfExists(success, "currency")
            }, () => {
                console.log("didn't find asset data as a currency")
                funcs.callFuncIfExists(failure)
            })
        })
    })

}

export const updateAssetDataPromise = async function (ticker, baseCurrency, lastDate, success, failure) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    console.log("==update asset data==")

    try {
        await updateStockDataPromise(ticker, baseCurrency, lastDate)
    } catch(e) {
        console.log("didn't find asset data as a stock")
        updateCryptoData(ticker, baseCurrency, lastDate, () => {
            console.log("found asset data as crypto")
            //funcs.callFuncIfExists(success, "crypto")
        }, () => {
            console.log("didn't find asset data as a crypto")
            updateCurrencyData(ticker, baseCurrency, lastDate, () => {
                console.log("found asset data as currency")
                //funcs.callFuncIfExists(success, "currency")
            }, () => {
                console.log("didn't find asset data as a currency")
                //funcs.callFuncIfExists(failure)
            })
        })
    }

}

export const loadStockData = function (ticker, baseCurrency, success, failure) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    alpha.data.daily_adjusted(ticker, "full", "json")
    .then((data) => {
        const pData = alpha.util.polish(data)


        for (const [date, data] of Object.entries(pData.data)) {
            console.log(ticker, date, parseFloat(data.adjusted))
            new AssetData({
                ticker,
                type : "stock",
                date,
                price : parseFloat(data.adjusted),
                baseCurrency
            }).save((err, sd) => {
                if (err) console.log(err)
                else console.log(sd.ticker, sd.date, sd.price)
            })
        }
        if (typeof success == "function") success()
    })
    .catch((error) => {
        console.log(error)
        if (typeof failure == "function") failure(error)
    })

}

export const updateStockDataPromise = async function (ticker, baseCurrency, lastDate) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    const data = await alpha.data.daily_adjusted(ticker, "compact", "json")

    const pData = alpha.util.polish(data)

    for (const [date, data] of Object.entries(pData.data)) {
        const luxonDate = Luxon.fromISO(date)
        if (luxonDate > lastDate) {
            //console.log(ticker, date, parseFloat(data.adjusted))
            await new AssetData({
                ticker,
                type : "stock",
                date,
                price : parseFloat(data.adjusted),
                baseCurrency
            }).save()
        }
    }
    return

}

export const loadAssetDataIfNeeded = function (ticker, success, failure) {
    ticker = ticker.toUpperCase()

    doWeHaveAssetData(ticker, (have) => {
        if (have) {
            if (typeof success == "function") success()
            return
        }
        loadAssetData(ticker, success, failure)
    })

}

export const loadCryptoData = async function (ticker, baseCurrency, success, failure) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    try {

        const data = await alpha.crypto.daily(ticker, baseCurrency)

        const pData = alpha.util.polish(data)

        console.log(pData)
    
        for (const [date, data] of Object.entries(pData.data)) {
            console.log(ticker, date, data)

            try {
                const savedAssetData = await new AssetData({
                    ticker,
                    type : "crypto",
                    date,
                    price : parseFloat(data.market_close),
                    baseCurrency
                }).save()
                console.log(savedAssetData.ticker, savedAssetData.date, savedAssetData.price)
                funcs.callFuncIfExists(success)
                return true
            } catch(e) {
                console.log(e)
            }
        }
        
    } catch(err) {
        console.log(err)
        funcs.callFuncIfExists(failure, err)
    }
    return false
}

export const updateCryptoData = function (ticker, baseCurrency, lastDate, success, failure) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    console.log("update crypto", ticker, baseCurrency)

    alpha.crypto.daily(ticker, baseCurrency)
    .then((data) => {

        console.log("got data")

        const pData = alpha.util.polish(data)


        //var i = 0;

        for (const [date, data] of Object.entries(pData.data)) {
            const luxonDate = Luxon.fromISO(date)

            if (luxonDate > lastDate) {
                console.log(ticker, date, parseFloat(data.market_close))
                new AssetData({
                    ticker,
                    type : "crypto",
                    date,
                    price : parseFloat(data.market_close),
                    baseCurrency
                }).save((err, savedData) => {
                    if (err) console.log(err)
                    else console.log(savedData.ticker, savedData.date, savedData.price)
                })
            }
        }
        funcs.callFuncIfExists(success)
    })
    .catch((err) => {
        console.log("error updating crypto", ticker)
        console.log(err)
        funcs.callFuncIfExists(failure, err)
    })

}

export const loadCurrencyData = async function (ticker, baseCurrency, success, failure) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    try {
        const data = await alpha.forex.rate(ticker, baseCurrency)

        const pData = alpha.util.polish(data)
        console.log(pData)

        for (const data of pData) {
            //console.log(ticker, date, parseFloat(data.value))
            const assetData = new AssetData({
                ticker,
                type : "currency",
                date : data.updated,
                price : parseFloat(data.value),
                baseCurrency
            })
            
            try {
                const ad = await assetData.save()
                console.log(ad.ticker, ad.date, ad.price)
            } catch(err) {
                console.log(err)
            }
        }
        funcs.callFuncIfExists(success)
        return true
        
    } catch(err) {
        console.log(err)
        funcs.callFuncIfExists(failure, err)
        return false
    }

}

export const updateCurrencyData = function (ticker, baseCurrency, lastDate, success, failure) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    console.log("WWW", ticker, baseCurrency)
    
    alpha.forex.rate(ticker, baseCurrency)
    .then((data) => {
        const pData = alpha.util.polish(data)

        console.log("WWW", pData)


        for (const [date, data] of Object.entries(pData)) {
            const luxonDate = Luxon.fromISO(date)
            if (luxonDate > lastDate) {
                console.log(ticker, date, parseFloat(data.value))
                new AssetData({
                    ticker,
                    type : "currency",
                    date : data.updated,
                    price : parseFloat(data.value),
                    baseCurrency
                }).save((err, savedData) => {
                    if (err) console.log(err)
                    else console.log(savedData)
                })
            }
        }
        funcs.callFuncIfExists(success)
    })
    .catch((err) => {
        console.log(err)
        funcs.callFuncIfExists(failure, err)
    })

}

/*
module.exports.getCurrencyPrice = async function(ticker, baseCurrency, success, failure) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    try {
        let data = await alpha.forex.rate(ticker, baseCurr)

        let pData = alpha.util.polish(data)

        console.log(pData);
    } catch(err) {
        console.log(err)
    }

}
*/



export const loadCurrencyExchangeDataIfNeeded = async function (toCurr, fromCurr, success, failure) {
    toCurr = toCurr.toUpperCase()
    //console.log("load currency exchange data if needed.")
    if (typeof fromCurr == "undefined") fromCurr = "USD"
    fromCurr = fromCurr.toUpperCase()

    //console.log(module.exports.doWeHaveCurrencyExchangeData)

    try {
        const have = await doWeHaveCurrencyExchangeData(toCurr, fromCurr)
    
        if ( ! have ) {
            try {
                await loadCurrencyExchangeDataPromise(toCurr, fromCurr)
                console.log("exchange rate data loaded")
                const reponse = "loaded"
                funcs.callFuncIfExists(success, reponse)
                return reponse
            } catch(e) {
                console.log(e)
                const reponse = e
                funcs.callFuncIfExists(failure, reponse)
                return reponse
            }
        } else {
            console.log("exchange rate data existed")
            const reponse = "existed"
            funcs.callFuncIfExists(success, reponse)
            return reponse
        }
    } catch(e) {
        console.log(e)
        const reponse = e
        funcs.callFuncIfExists(failure, reponse)
        return reponse
    }
    
}

export const updateCurrencyExchangeDataIfNeededPromise = async function (toCurr, fromCurr, date, success, failure) {
    toCurr = toCurr.toUpperCase()
    //console.log("update currency exchange data if needed promise")
    if (typeof fromCurr == "undefined") fromCurr = "USD"
    fromCurr = fromCurr.toUpperCase()

    //if (date == null) date = Luxon.local()
    date = Luxon.local()

    const gbx = toCurr === "GBX"
    if (gbx) toCurr = "GBP"

    try {
        const have = await doWeHaveRecentCurrencyExchangeDataPromise(toCurr, fromCurr, date)
    
        if ( ! have ) {
            console.log("loading curr data because we don't have recent")
            try {
                await loadCurrencyExchangeDataPromise(toCurr, fromCurr)
                //console.log("loaded")
                const result = toCurr + " " + fromCurr + " data loaded"
                funcs.callFuncIfExists(success, result)
                return result
            } catch(err) {
                console.log(err)
                funcs.callFuncIfExists(failure, err)
                return
            }
        } else {
            //console.log("existed")
            const result = toCurr + " " + fromCurr + " data existed"
            funcs.callFuncIfExists(success, result)
            return result
        }
    } catch(err) {
        console.log(err)
        funcs.callFuncIfExists(failure)
        return
    }
}

export const doWeHaveCurrencyExchangeData = async function (toCurr, fromCurr, success, failure) {
    toCurr = toCurr.toUpperCase()
    //console.log("do we have curr ex data")
    if (typeof fromCurr == "undefined") fromCurr = "USD"
    fromCurr = fromCurr.toUpperCase()

    CurrencyExchange.findOne({ toCurr, fromCurr }, (err, exchangeData) => {
        if (err) {
            console.log(err)
            funcs.callFuncIfExists(failure, err)
            return
        }

        if (exchangeData != null) success(true)
        else success(false)
    })
}

export const doWeHaveRecentCurrencyExchangeDataPromise = async function (toCurr, fromCurr, date) {
    toCurr = toCurr.toUpperCase()

    //console.log("do we have recent curr ex data?")

    if (typeof fromCurr == "undefined") fromCurr = "USD"
    fromCurr = fromCurr.toUpperCase()

    date = date.toUTC().startOf("day")


    try {
        const exchangeData = await CurrencyExchange.findOne(
            { toCurr, fromCurr },
            null,
            { sort: { date : "desc" } }
        ).exec()

        if (exchangeData != null) {
            const lastDate = Luxon.fromJSDate(exchangeData.date)
            ////// Improve the precise date check to avoid unnecessary fetching,
            ////// e.g. checking discrete days not hours, mins, secs
            if (lastDate >= date.minus({ days : 2})) {
                //console.log("recent fx data exists for " + toCurr + " + " + fromCurr)
                return true
            } else {
                //console.log("fx data outdated for " + toCurr + " + " + fromCurr, lastDate.toISO())
                return false
            }
        } else {
            //console.log("no fx data for " + toCurr + " + " + fromCurr)
            return false
        }

    } catch(err) {
        console.log(err)
    }
}

export const loadCurrencyExchangeDataPromise = async function (toCurr, fromCurr) {
    toCurr = toCurr.toUpperCase()
    //console.log("load currency exchange data. typeof fromCurr", typeof fromCurr)
    if (typeof fromCurr == "undefined") fromCurr = "USD"
    fromCurr = fromCurr.toUpperCase()

    try {
        //// Alpha Vantage is weird
        //let getCurr = fromCurr
        //let inCurr = toCurr
        const data = await alpha.forex.dailyExt(fromCurr, toCurr, "full")

        const pData = alpha.util.polish(data)
        console.log(pData)

    
        let last = {}

        for (const [date, data] of Object.entries(pData.data)) {
            //console.log(ticker, date, parseFloat(data.market_close))
            new CurrencyExchange({
                toCurr,
                fromCurr,
                date,
                rate : parseFloat(data.close)
            }).save((err, sd) => {
                if (err) console.log(err)
                else {
                    console.log(sd.toCurr, sd.fromCurr, sd.date, sd.rate)
                    if (!last.date || sd.date > last.date) last = sd
                }
            })
        }

        return last
        
    } catch(err) {
        console.log(err)
    }

}

export const updateCurrencyExchangeDataPromise = async function (toCurr, fromCurr) {
    toCurr = toCurr.toUpperCase()
    //console.log("load currency exchange data. typeof fromCurr", typeof fromCurr)
    if (typeof fromCurr == "undefined") fromCurr = "USD"
    fromCurr = fromCurr.toUpperCase()

    try { //// Alpha Vantage is weird
        //let getCurr = fromCurr
        //let inCurr = toCurr
        const data = await alpha.forex.dailyExt(fromCurr, toCurr, "compact")

        const pData = alpha.util.polish(data)
        console.log(pData)

    
        let last = {}

        for (const [date, data] of Object.entries(pData.data)) {
            //console.log(ticker, date, parseFloat(data.market_close))
            new CurrencyExchange({
                toCurr,
                fromCurr,
                date,
                rate : parseFloat(data.close)
            }).save((err, sd) => {
                if (err) console.log(err)
                else {
                    console.log(sd.toCurr, sd.fromCurr, sd.date, sd.rate)
                    if (!last.date || sd.date > last.date) last = sd
                }
            })
        }

        return last
        
    } catch(err) {
        console.log(err)
    }

}

export const loadCurrencyExchangeDataDual = async function (toCurr, fromCurr, success, failure) {
    toCurr = toCurr.toUpperCase()
    //console.log("load currency exchange data. typeof fromCurr", typeof fromCurr)
    if (typeof fromCurr == "undefined") fromCurr = "USD"
    fromCurr = fromCurr.toUpperCase()

    try { //// Alpha Vantage is weird
        //let getCurr = fromCurr
        //let inCurr = toCurr
        const data = await alpha.forex.dailyExt(fromCurr, toCurr, "full")

        const pData = alpha.util.polish(data)
        console.log(pData)

    
        for (const [date, data] of Object.entries(pData.data)) {
            //console.log(ticker, date, parseFloat(data.market_close))
            new CurrencyExchange({
                toCurr,
                fromCurr,
                date,
                rate : parseFloat(data.close)
            }).save((err, sd) => {
                if (err) console.log(err)
                else console.log(sd.toCurr, sd.fromCurr, sd.date, sd.rate)
            })
        }
        funcs.callFuncIfExists(success)
        return
        
    } catch(err) {
        console.log(err)
        funcs.callFuncIfExists(failure, err)
    }

}

export const getCurrencyExchangeRateUpdateIfNeededPromise = async function (toCurr, fromCurr, date) {
    toCurr = toCurr.toUpperCase()
    //console.log("load currency exchange data. typeof fromCurr", typeof fromCurr)
    if (typeof fromCurr == "undefined") fromCurr = "USD"
    fromCurr = fromCurr.toUpperCase()

    const toGbx = (toCurr === "GBX")
    if (toGbx) toCurr = "GBP"

    const fromGbx = (fromCurr === "GBX")
    if (fromGbx) fromCurr = "GBP"

    //console.log("update if needed")

    //console.log( "getting currency data", toCurr, fromCurr, date, toGbx, fromGbx )

    await updateCurrencyExchangeDataIfNeededPromise(toCurr, fromCurr, date)

    const rateData = await getCurrencyExchangeRatePromise(toCurr, fromCurr, date)
    
    //console.log( "getCurrencyExchangeRateUpdateIfNeededPromise", toCurr, fromCurr,
    //    date, rateData, toGbx, fromGbx )
    if (toGbx) rateData.rate *= 100
    if (fromGbx) rateData.rate /= 100
    return rateData
}

export const getCurrencyExchangeRatePromise = async function (toCurr, fromCurr, date) {
    toCurr = toCurr.toUpperCase()
    //console.log("get currency exchange rate", toCurr, fromCurr, date.toISO())
    if (typeof fromCurr == "undefined") fromCurr = "USD"
    fromCurr = fromCurr.toUpperCase()


    date = date.toUTC().startOf('day')
    try {
        //// Alpha Vantage is weird.
        const exchangeData = await CurrencyExchange.findOne({ toCurr, fromCurr, date : date.toISO() }).exec()
        
        if (exchangeData != null) {
            return exchangeData
        } else {

            console.log("fx going back one day")
            date = date.minus({days : 1})
            
            //// Alpha Vantage is weird.
            const exchangeData = await CurrencyExchange
                .findOne({ toCurr, fromCurr, date : date.toISO() })
                .exec()
            
            if (exchangeData != null) {
                return exchangeData
            } else {

                console.log("fx going back two days")
                date = date.minus({days : 1})
                //console.log("find fx 2", { toCurr : toCurr, fromCurr : fromCurr, date : date.toISO() })
                
                //// Alpha Vantage is weird.
                const exchangeData = await CurrencyExchange.findOne({ toCurr, fromCurr, date : date.toISO() })
                
                if (exchangeData != null) {
                    return exchangeData
                } else {
                    console.log("loading curr data because we couldn't find any when getting rate")
                    const last = await updateCurrencyExchangeDataPromise(toCurr, fromCurr)
                        
                    return last
                    // recurse, to try to retreive the new rate. Let's hope we don't get infinite loops
                    
                    //return await module.exports.getCurrencyExchangeRatePromise(toCurr, fromCurr, date)
                }

            }

        }
    } catch(err) {
        console.log(err)
    }
}