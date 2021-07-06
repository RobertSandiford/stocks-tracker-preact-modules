const { Luxon } = require('../../../../lib/luxon')
const assets = require('../../../../lib/assets')


module.exports = {
    getExchangeRate : {
        format : "(toCurr : String!, fromCurr : String!) : ExchangeRate",
        resolver : async (parentObject, {toCurr, fromCurr}) => {
            const rateData = await assets.getCurrencyExchangeRateUpdateIfNeededPromise(
                toCurr, fromCurr, Luxon.local()
            )
        
            return rateData
        }
    }
}