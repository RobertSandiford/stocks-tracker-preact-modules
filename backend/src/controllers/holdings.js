

const assets = require('../lib/assets')

module.exports.list = async (req, res) => {

    let loading = false
    let mainLoading = {}


    let currencies = [req.query.displayCurrency, req.query.secondCurrency]
    let fx = {}

    let groups = []

    for (const c of currencies) {
        if (c === "USD") continue // skip USD, which we are using as de-facto base currency

        let toCurr = c
        let fromCurr = "USD"
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
                        /*assets.updateCurrencyExchangeDataIfNeeded(holding.buyCurrency, "USD", Luxon.local(),
                            () => { console.log("fetched currency exchange data") },
                            () => { console.log("error fetching currency exchange data") })*/

                        let buyDate = Luxon.fromJSDate(holding.buyDate)
                        //console.log("buyDate", buyDate.toISO())

                        let toCurr = "USD"
                        //let key = "buyRate"
                        assets.getCurrencyExchangeRateUpdateIfNeeded(toCurr, holding.buyCurrency, buyDate,
                            (rate) => { 
                                //console.log("fetched currency exchange data, rate: " + rate)
                                
                                let key = "buyRate"
                                console.log("key should be buyRate", key)
                                holdings[i][key] = {}
                                holdings[i][key][toCurr] = rate
                                delete holdings[i].loading[key]
                            },
                            () => { 
                                let key = "buyRate"
                                console.log("error fetching currency exchange data") 
                                delete holdings[i].loading[key]
                            })

                        //key = "currentRate"
                        assets.getCurrencyExchangeRateUpdateIfNeeded(toCurr, holding.buyCurrency, Luxon.local(),
                            (rate) => { 
                                //console.log("fetched currency exchange data, rate: " + rate)
                                let key = "currentRate"
                                console.log("key should be currentRate", key)
                                holdings[i][key] = {}
                                holdings[i][key][toCurr] = rate
                                delete holdings[i].loading[key]
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

                        //console.log("next")
                    }

                    let p = await assets.getLastPrice(holding.ticker, holding.buyCurrency)
                    //console.log("p", p)
                    if (p != null) {
                        holdings[i].currentUnitPrice = p.price
                        holdings[i].currentPriceDate = p.date
                    } 
                }

            }

            let j = 1;

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
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            console.log("responding")

            response = {
                status : "OK",
                holdings : holdings,
                groups : groups
            }
            // add currency exchange data
            console.log(Object.keys(fx).length)
            if (Object.keys(fx).length > 0) response.fx = fx
            //console.log(response)

            res.setHeader('Content-Type', 'application/json');
            res.send(response);  
        }
    );

}



/*
module.exports.holdingsAdd = async (req, res) => {

    console.log("adding holding", req.body)

    let holdingData = req.body

    new Promise( async resolve => {

        console.log( "holdingData", holdingData )
        console.log( "buy date", typeof holdingData.buyDate, holdingData.buyDate )
        if (holdingData.priceCurrency != holdingData.buyCurrency) {
            let buyDate = Luxon.fromISO(holdingData.buyDate)
            console.log( "buy date", holdingData.buyDate, buyDate )

            try {
                let rate = await assets.getCurrencyExchangeRateUpdateIfNeededPromise(holdingData.priceCurrency, holdingData.buyCurrency, buyDate)
                
                console.log( "rate", rate )
                holdingData.buyUnitPrice = roundDp(holdingData.buyUnitPrice * rate, 2)
                holdingData.buyTotalPrice = roundDp(holdingData.buyTotalPrice * rate, 2)

                resolve(holdingData)
            } catch(e) {
                console.log("err: " + e)
            }

        } else {
            resolve(holdingData)
        }

    }).then( holdingData => {

        let holding = new Holding(holdingData)

        console.log("adding holding 2", holding, typeof holding.buyUnitPrice, holding.buyUnitPrice)

        // save model to database
        holding.save(function (err, holding) {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    status : "ERROR",
                    reason : "Could not save record"
                }));
                return console.error(err);
            }
            console.log("Holding saved", holding);
            holding = holding.toObject()
            //holding.id = holding._id
            
            console.log("Holding id updated", holding);

            // fetch historical holding price data if there is none
            assets.loadAssetDataIfNeeded(holding.ticker, holding.type)

            // fetch exchange rate data if needed
            if (holding.buyCurrency != "USD") {
                assets.updateCurrencyExchangeDataIfNeeded(holding.buyCurrency, "USD", Luxon.local(),
                    () => { console.log("fetched currency exchange data") },
                    () => { console.log("error fetching currency exchange data") })
            }
            
            //respond
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                status : "OK",
                holding : holding
            }))
        })

    })

})
*/

/*
module.exports.holdingsUpdate = (req, res) => {

    console.log("updating holding", req.body)

    let holding = req.body

    let currTime = Luxon.local().toISO();
    console.log("currTime", currTime)
    holding.currentPriceDate = currTime

    console.log("try update", holding)

    Holding.findOneAndUpdate(
        { _id : holding._id },
        holding,
        { new : true }
    ).lean().exec(
        (err, newHolding) => {

            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    status : "ERROR",
                    reason : "Could not update record"
                }));
                return console.error(err);
            }


            console.log(newHolding)
            
            //respond
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                status : "OK",
                holding : newHolding
            }));

        }
    )

})
*/

/*
module.exports.holdingsRemove = (req, res) => {

    let holding = req.body
    //holding._id = holding.id

    console.log("removing holding", holding)

    if ( ! holding._id ) { console.log("exiting remove holding because _id is not set/valid"); return }

    // delete holding
    Holding.deleteOne(holding, (err, result) => {
        if (err) {
            res.setHeader('Content-Type', 'application/json');
            let response = {
                status : "ERROR",
                reason : "Could not delete record"
            }
            res.end(JSON.stringify(response));
            return console.error("error", err, response);
        }

        if (result.deletedCount === 0) {
            res.setHeader('Content-Type', 'application/json');
            let response = {
                status : "NOOP",
                reason : "No records deleted"
            }
            res.end(JSON.stringify(response));
            return console.log("response: ", response)
        }

        console.log("Holding deleted " + holding._id);
        console.log("result: ", result)
        res.setHeader('Content-Type', 'application/json');
        let response = {
            status : "OK",
            _id : holding._id
        }
        res.end(JSON.stringify(response));
        return console.log("response: ", response)
    });

})
*/