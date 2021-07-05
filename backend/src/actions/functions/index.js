const { Luxon } = require('../../lib/luxon')

const _ = {}
_.cloneDeep = require('lodash.clonedeep')

const assets = require('../lib/assets')

module.exports.getHoldingCurrencyRates = (tempHolding, displayCurrency = "USD") => {

    const holding = _.cloneDeep(tempHolding)

    if (holding.priceCurrency != displayCurrency) {
        /*assets.updateCurrencyExchangeDataIfNeededPromise(holding.buyCurrency, "USD", Luxon.local(),
            () => { console.log("fetched currency exchange data") },
            () => { console.log("error fetching currency exchange data") })*/

        let buyDate = Luxon.fromJSDate(holding.buyDate)
        //console.log("buyDate", buyDate.toISO())

        let toCurr = displayCurrency
        //let key = "buyRate"
        console.log("get buy exchange rate", toCurr, holding.priceCurrency)
        assets.getCurrencyExchangeRateUpdateIfNeeded(toCurr, holding.priceCurrency, buyDate,
            (rate) => { 
                //console.log("fetched currency exchange data, rate: " + rate)
                
                let key = "buyRate"
                //console.log("key should be buyRate", key)
                holdings[i][key] = {}
                //holdings[i][key][toCurr] = rate
                holdings[i][key] = rate
                delete holdings[i].loading[key]

                console.log(key + " set for " + holdings[i].name + " rate: ", rate)
            },
            () => { 
                let key = "buyRate"
                console.log("error fetching currency exchange data") 
                delete holdings[i].loading[key]
            })


        //key = "currentRate"
        console.log("get current exchange rate for holding", toCurr, holding.priceCurrency)
        assets.getCurrencyExchangeRateUpdateIfNeeded(toCurr, holding.priceCurrency, Luxon.local(),
            (rate) => { 
                //console.log("fetched currency exchange data, rate: " + rate)
                let key = "currentRate"
                //console.log("key should be currentRate", key)
                holdings[i][key] = {}
                //holdings[i][key][toCurr] = rate
                holdings[i][key] = rate
                delete holdings[i].loading[key]

                console.log(key + " set for " + holdings[i].name + " rate: ", rate)
            },
            () => { 
                let key = "currentRate"
                console.log("error fetching currency exchange data") 
                delete holdings[i].loading[key]
            })

        //let rate = assets.getCurrencyExchangeRateUpdateIfNeeded("USD", holding.buyCurrency, buyDate)

        holdings[i].loading = {}
        holdings[i].loading["buyRate"] = true
        holdings[i].loading["currentRate"] = true

        loading = true

        if (holding.closes.length > 0) {
            holdings[i].loading.closes = {}
            for ( const [ci, close] of holding.closes.entries() ) {

                holdings[i].loading.closes[ci] = true

                console.log("************close date", close.sellDate, Luxon.fromJSDate(close.sellDate))
                //return

                assets.getCurrencyExchangeRateUpdateIfNeeded(toCurr, holding.priceCurrency, Luxon.fromJSDate(close.sellDate),
                    (rate) => { 
                        //console.log("fetched currency exchange data, rate: " + rate)
                        //let key = "sellRate"
                        //holdings[i][key][toCurr] = rate
                        holdings[i].closes[ci].sellRate = rate

                        delete holdings[i].loading.closes[ci]
                        if (Object.keys(holdings[i].loading.closes).length === 0) delete holdings[i].loading.closes
                    },
                    () => { 
                        //let key = "sellRate"
                        console.log("error fetching currency exchange data for holding close") 

                        delete holdings[i].loading.closes[ci]
                        if (Object.keys(holdings[i].loading.closes)/length === 0) delete holdings[i].loading.closes
                    }
                )

            }
        }

    }
}
