
const assets = require('../lib/assets')
const respond = require('./respond')
const { Luxon } = require('../lib/luxon')



module.exports.rateGbp = async (req, res) => {

    const rateData = await assets.getCurrencyExchangeRateUpdateIfNeededPromise("GBP", "USD", Luxon.local())

    const response = {
        rateData
    }
    respond(res, response)
    
}

module.exports.rate = async (req, res) => {

    const toCurr = req.query.toCurr
    const rateData = await assets.getCurrencyExchangeRateUpdateIfNeededPromise(toCurr, "USD", Luxon.local())

    const response = {
        rateData
    }
    respond(res, response)
    
}
