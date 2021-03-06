
// date-times
import { Luxon } from './luxon'

// alpha vantage API smanager
import * as av from './av'

// funds API manager
import * as funds from './funds'

import * as funcs from './apiFuncs'
import Asset from '../models/Asset'
import AssetData from '../models/AssetData'


export const getLastPrice = async function (ticker, baseCurrency) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()
    
    try {

        const data = await AssetData.findOne({ ticker, baseCurrency }).sort({ date : "desc" }).exec()
    
        //console.log(ticker, data)
        return data
    
    } catch(err) {
        console.log(err)
    }

}

export const getLastPricePromise = getLastPrice

export const getDateOfLastPrice = function (ticker, type, baseCurrency, success, failure) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()


    console.log("checking date of last price", ticker, type, baseCurrency)

    AssetData.findOne({ ticker, type, baseCurrency }, null, { sort: { date : "desc" } }, (err, data) => {
        if (err) {
            console.log(err)
            funcs.callFuncIfExists(failure, err)
        } else {
            if (data != null) {
                console.log(ticker, "last price date: ", data.date)
                success(data.date)
            } else {
                console.log(ticker, "last price date: ", null)
                success(new Date("1970-01-01T00:00:00Z"))
            }
        }
    })
}

export const getDateOfLastPricePromise = async function (ticker, type, baseCurrency) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    //console.log("checking date of last price", ticker, type, baseCurrency)

    try {

        const data = await AssetData.findOne({ ticker, type, baseCurrency }, null, { sort: { date : "desc" } }).exec()
    
        if (data != null) {
            //console.log(ticker, "last price date: ", data.date)
            return data.date
        } else {
            //console.log(ticker, "last price date: ", null)
            return new Date("1970-01-01T00:00:00Z")
        }

    } catch(err) {
        console.log(err)
    }
}

/*module.exports.getAsset = function() {

}*/

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

export const doWeHaveAssetData = function (ticker, success, baseCurrency) {
    ticker = ticker.toUpperCase()


    AssetData.findOne({ ticker }, (err, assetData) => {
        if (err) { console.log(err); return }

        //console.log(typeof AssetData, AssetData)

        if (assetData != null) success(true)
        else success(false)
    })
}

export const loadAssetDataIfNeeded = function (ticker, type, baseCurrency, success, failure) {
    ticker = ticker.toUpperCase()

    doWeHaveAssetData(ticker, (have) => {
        if (have) {
            if (typeof success == "function") success()
            return
        }
        loadAssetData(ticker, type, baseCurrency, success, failure)
    })

}

export const loadAssetData = function (ticker, baseCurrency, type, success, failure) {
    ticker = ticker.toUpperCase()

    //console.log("==look for asset data==")
    //console.log(type)

    switch (type) {
        case "stock":
        //console.log("==stock==")
            av.loadStockData(
                ticker,
                baseCurrency,
                () => { // success
                //console.log("found asset data as stock")
                    funcs.callFuncIfExists(success)
                },
                () => {
                //console.log("didn't find asset data as a stock")
                    funcs.callFuncIfExists(failure)
                }
            )
            break
        case "crypto":
        //console.log("==crypto==")
            av.loadCryptoData(
                ticker,
                baseCurrency,
                () => { // success
                //console.log("found asset data a a crypto")
                    funcs.callFuncIfExists(success)
                },
                () => {
                //console.log("didn't find asset data as a crypto")
                    funcs.callFuncIfExists(failure)
                }
            )
            break
        case "currency":
        //console.log("==currency==")
            av.loadCurrencyData(
                ticker,
                baseCurrency,
                () => { // success
                //console.log("found asset data a a currency")
                    funcs.callFuncIfExists(success)
                },
                () => {
                //console.log("didn't find asset data as a currency")
                    funcs.callFuncIfExists(failure)
                }
            )
            break
        case "fund":
        //console.log("==fund==")
            funds.loadFundData(
                ticker,
                baseCurrency,
                () => { // success
                //console.log("found asset data as a fund")
                    funcs.callFuncIfExists(success)
                },
                () => {
                //console.log("didn't find asset data as a fund")
                    funcs.callFuncIfExists(failure)
                }
            )
            break
        case "custom":
        //console.log("==custom==")
            funcs.callFuncIfExists(success)
            break
    }
}

///// old version
/*
module.exports.loadAssetData = function(ticker, type, success, failure) {
    ticker = ticker.toUpperCase()

    console.log("==look for asset data==")
    av.loadStockData(
        ticker,
        () => { // success
            console.log("found asset data as stock")
            funcs.callFuncIfExists(success, "stock")
        },
        () => {
            console.log("didn't find asset data as a stock")
            av.loadCryptoData(
                ticker,
                () => {
                    console.log("found asset data as crypto")
                    funcs.callFuncIfExists(success, "crypto")
                },
                () => {
                    console.log("didn't find asset data as a crypto")
                    av.loadCurrencyData(
                        ticker,
                        () => {
                            console.log("found asset data as a currency")
                            funcs.callFuncIfExists(success, "currency")
                        },
                        () => {
                            console.log("didn't find asset data as a currency")
                            funds.loadCurrencyData(
                                ticker,
                                () => {
                                    console.log("found asset data a fund")
                                    funcs.callFuncIfExists(success, "fund")
                                },
                                () => {
                                    console.log("didn't find asset data as a fund")
                                    funcs.callFuncIfExists(failure)
                                }
                            )
                        }
                    )
                }
            )
        }
    )

}
*/


export const updateAssetDataIfNeeded = function (ticker, type, baseCurrency) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    getDateOfLastPrice(ticker, type, baseCurrency, (date) => {
        date = Luxon.fromJSDate(date)

        const now = Luxon.local()

        if ( now > date.plus({ days: 2 }) ) {
            console.log("Let's fetch new price data for " + ticker)

            updateAssetData(ticker, type, baseCurrency, date)
        }
    })

}

export const updateAssetDataIfNeededPromise = async function (ticker, type, baseCurrency) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    try {
        let date = await getDateOfLastPricePromise(ticker, type, baseCurrency)
        date = Luxon.fromJSDate(date)

        const now = Luxon.local()

        if ( now > date.plus({ days: 2 }) ) {
            console.log("Let's fetch new price data for " + ticker)

            return updateAssetDataPromise(ticker, type, baseCurrency, date)
        }
    } catch(err) {
        console.log(err)
    }

}

/*
module.exports.updateAssetDataIfNeeded = function(holding) {
    ticker = ticker.toUpperCase()

    module.exports.getDateOfLastPrice(ticker, type, (date) => {
        date = Luxon.fromJSDate(date)

        let now = Luxon.local()

        if ( now > date.plus({ days: 2 }) ) {
            console.log("Let's fetch new price data for " + ticker)

            module.exports.updateAssetData(ticker, type, date)
        }
    })

}
*/


export const updateAssetData = function (ticker, type, baseCurrency, lastDate, success, failure) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    console.log("==update asset==")
    console.log(type)

    switch (type) {
        case "stock":
            //console.log("==stock==")
            av.updateStockDataPromise(
                ticker,
                baseCurrency,
                lastDate,
                () => { // success
                    console.log("found asset data as stock")
                    funcs.callFuncIfExists(success)
                },
                () => {
                    console.log("didn't find asset data as a stock")
                    funcs.callFuncIfExists(failure)
                }
            )
            break
        case "crypto":
            //console.log("==crypto==")
            av.updateCryptoData(
                ticker,
                baseCurrency,
                lastDate,
                () => { // success
                    console.log("found asset data a a crypto")
                    funcs.callFuncIfExists(success)
                },
                () => {
                    console.log("didn't find asset data as a crypto")
                    funcs.callFuncIfExists(failure)
                }
            )
            break
        case "currency":
            //console.log("==currency==")
            av.updateCurrencyData(
                ticker,
                baseCurrency,
                lastDate,
                () => { // success
                    console.log("found asset data a a currency")
                    funcs.callFuncIfExists(success)
                },
                () => {
                    console.log("didn't find asset data as a currency")
                    funcs.callFuncIfExists(failure)
                }
            )
            break
        case "fund":
            //console.log("==fund==")
            funds.updateFundData(
                ticker,
                baseCurrency,
                lastDate,
                () => { // success
                    console.log("found asset data a a fund")
                    funcs.callFuncIfExists(success)
                },
                () => {
                    console.log("didn't find asset data as a fund")
                    funcs.callFuncIfExists(failure)
                }
            )
            break
        case "custom":
            //console.log("==custom==")
            funcs.callFuncIfExists(success)
            break
    }
}

export const updateAssetDataPromise = async function (ticker, type, baseCurrency, lastDate) {
    ticker = ticker.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    //console.log("==update asset==")
    //console.log(type)

    switch (type) {
        case "stock":
            //console.log("==stock==")
            try {
                const success = await av.updateStockDataPromise(ticker, baseCurrency, lastDate)
                if (success) {
                    console.log("found asset data as stock", ticker)
                } else {
                    console.log("didn't find asset data as a stock", ticker)
                }
            } catch(err) {
                console.log(err)
            }
            break
        case "crypto":
            //console.log("==crypto==")
            try {
                const success = await av.updateCryptoData(ticker, baseCurrency, lastDate)
                if (success) {
                    console.log("found asset data a a crypto", ticker)
                } else {
                    console.log("didn't find asset data as a crypto", ticker)
                }
            } catch(err) {
                console.log(err)
            }
            break
        case "currency":
            //console.log("==currency==")
            try {
                const success = await av.updateCurrencyData(ticker, baseCurrency, lastDate)
                if (success) {
                    console.log("found asset data as a currency", ticker)
                } else {
                    console.log("didn't find asset data as a currency", ticker)
                }
            } catch(err) {
                console.log(err)
            }
            break
        case "fund":
            //console.log("==fund==")
            try {
                const success = await funds.updateFundData(ticker, baseCurrency, lastDate)
                if (success) {
                    console.log("found asset data a a fund")
                } else {
                    console.log("didn't find asset data as a fund")
                }
            } catch(err) {
                console.log(err)
            }
            break
        case "custom":
            //console.log("==custom==")
            break
    }
}

/*
module.exports.updateAssetData = function(ticker, lastDate, success, failure) {
    ticker = ticker.toUpperCase()

    console.log("==update asset data==")

    av.updateStockData(
        ticker,
        lastDate,
        () => { // success
            console.log("found asset data as stock")
            //funcs.callFuncIfExists(success, "stock")
        },
        () => {
            console.log("didn't find asset data as a stock")
            av.updateCryptoData(
                ticker,
                lastDate,
                () => {
                    console.log("found asset data as crypto")
                    //funcs.callFuncIfExists(success, "crypto")
                },
                () => {
                    console.log("didn't find asset data as a crypto")
                    av.updateCurrencyData(
                        ticker,
                        lastDate,
                        () => {
                            console.log("found asset data as currency")
                            //funcs.callFuncIfExists(success, "currency")
                        },
                        () => {
                            console.log("didn't find asset data as a currency")
                            funds.updateFundData(
                                ticker,
                                lastDate,
                                () => {
                                    console.log("found asset data as a fund")
                                    //funcs.callFuncIfExists(success, "currency")
                                },
                                () => {
                                    console.log("didn't find asset data as a fund")
                                    //funcs.callFuncIfExists(failure)
                                }
                            )
                        }
                    )
                }
            )
        }
    )

}
*/


export const loadCurrencyExchangeDataIfNeeded = av.loadCurrencyExchangeDataIfNeeded

export const updateCurrencyExchangeDataIfNeededPromise = av.updateCurrencyExchangeDataIfNeededPromise
export const getCurrencyExchangeRatePromise = av.getCurrencyExchangeRatePromise

//module.exports.getCurrencyExchangeRateUpdateIfNeeded = av.getCurrencyExchangeRateUpdateIfNeeded
//module.exports.getCurrencyExchangeRateUpdateIfNeededAwaitable = av.getCurrencyExchangeRateUpdateIfNeededAwaitable
export const getCurrencyExchangeRateUpdateIfNeededPromise = av.getCurrencyExchangeRateUpdateIfNeededPromise