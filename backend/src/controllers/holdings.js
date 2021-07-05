
const assets = require('../lib/assets')
const { Luxon } = require('../lib/luxon')
const Holding = require('../models/Holding')



module.exports.list = async (req, res) => {

    let loading = false
    const mainLoading = {}


    const currencies = [req.query.displayCurrency, req.query.secondCurrency]
    const fx = {}

    const groups = []

    for (const c of currencies) {
        if (c === "USD") continue // skip USD, which we are using as de-facto base currency

        const toCurr = c
        const fromCurr = "USD"
        assets.getCurrencyExchangeRateUpdateIfNeeded(toCurr, fromCurr, Luxon.local(),
            (rate) => {
                //console.log("fetched currency exchange data, rate: " + rate)
                fx[toCurr] = rate
                mainLoading["currency_" + toCurr] = false
            },
            () => {
                console.log("error fetching currency exchange data")
                mainLoading["currency_" + toCurr] = false
            })
        loading = true
        mainLoading["currency_" + toCurr] = true
    }



    Holding.find({ user : req.query.user })/*.limit(999)*/.lean().exec(
        async (err, holdings) => {


            for (const [i, holding] of holdings.entries()) {
                //console.log(i)

                if ( holding.group !== "" && ! groups.includes(holding.group) ) groups.push(holding.group)

                if ( holding.type != "custom") {


                    // check if data is outdated, and fetch new data if needed
                    assets.updateAssetDataIfNeeded(holding.ticker, holding.type, holding.buyCurrency)
                    //assets.updateAssetDataIfNeeded(holding)

                    // fetch exchange rate data if needed
                    if (holding.buyCurrency != "USD") {
                        /*assets.updateCurrencyExchangeDataIfNeededPromise(holding.buyCurrency, "USD", Luxon.local(),
                            () => { console.log("fetched currency exchange data") },
                            () => { console.log("error fetching currency exchange data") })*/

                        const buyDate = Luxon.fromJSDate(holding.buyDate)
                        //console.log("buyDate", buyDate.toISO())

                        const toCurr = "USD"
                        //let key = "buyRate"
                        assets.getCurrencyExchangeRateUpdateIfNeeded(toCurr, holding.buyCurrency, buyDate,
                            (rate) => {
                                //console.log("fetched currency exchange data, rate: " + rate)
                                
                                const key = "buyRate"
                                console.log("key should be buyRate", key)
                                holdings[i][key] = {}
                                holdings[i][key][toCurr] = rate
                                delete holdings[i].loading[key]
                            },
                            () => {
                                const key = "buyRate"
                                console.log("error fetching currency exchange data")
                                delete holdings[i].loading[key]
                            })

                        //key = "currentRate"
                        assets.getCurrencyExchangeRateUpdateIfNeeded(toCurr, holding.buyCurrency, Luxon.local(),
                            (rate) => {
                                //console.log("fetched currency exchange data, rate: " + rate)
                                const key = "currentRate"
                                console.log("key should be currentRate", key)
                                holdings[i][key] = {}
                                holdings[i][key][toCurr] = rate
                                delete holdings[i].loading[key]
                            },
                            () => {
                                const key = "currentRate"
                                console.log("error fetching currency exchange data")
                                delete holdings[i].loading[key]
                            })

                        //let rate = assets.getCurrencyExchangeRateUpdateIfNeeded("USD", holding.buyCurrency, buyDate)

                        holdings[i].loading = {}
                        holdings[i].loading["buyRate"] = true
                        holdings[i].loading["currentRate"] = true

                        loading = true

                        //console.log("next")
                    }

                    const p = await assets.getLastPrice(holding.ticker, holding.buyCurrency)
                    //console.log("p", p)
                    if (p != null) {
                        holdings[i].currentUnitPrice = p.price
                        holdings[i].currentPriceDate = p.date
                    }
                }

            }

            let j = 1

            while (loading) {
                //console.log("see if it has loaded")
                loading = false
                for (const k in mainLoading) {
                    if (mainLoading[k]) {
                        console.log("main " + k + " still loading")
                        loading = true
                        break
                    }
                }
                if ( ! loading ) {
                    for (const [i, holding] of holdings.entries()) {
                        //console.log(i)
                        if (holding.loading) {
                            //console.log("loading length: " + Object.keys(holding.loading).length)
                            if (Object.keys(holding.loading).length > 0) {
                                console.log("holding " + i + " still loading", holding.loading)
                                loading = true
                                break
                            }
                        }
                    }
                }
                if (loading) {
                    console.log("sleeping while it loads", j)
                    j++
                    await new Promise(resolve => setTimeout(resolve, 200))
                }
            }

            console.log("responding")

            const response = {
                status : "OK",
                holdings,
                groups
            }
            // add currency exchange data
            console.log(Object.keys(fx).length)
            if (Object.keys(fx).length > 0) response.fx = fx
            //console.log(response)

            res.setHeader('Content-Type', 'application/json')
            res.send(response)
        }
    )

}