require('dotenv').config();

const { DateTime : Luxon , Settings : LuxonSettings } = require('luxon');
LuxonSettings.defaultLocale = "en-GB"
let stDateFormat = Object.assign(Luxon.DATE_MED, { });

const axios = require("axios").default;

const funcs = require("./apiFuncs")

const apiKey = process.env.funds_api_key
const apiHost = process.env.funds_api_host



module.exports.loadFundData = async function(isin, baseCurrency, success, failure/*, baseCurr = "USD"*/) {
    isin = isin.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    console.log("load fund data");

    if (typeof isin === "string" && isin !== "") {

        axios.request({
            method: 'GET',
            url: 'https://funds.p.rapidapi.com/v1/fund/' + isin,
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            }
        })
        .then(function (response) {
            let data = response.data
            // data.price
            // data.market
            console.log(data);

            let date = Luxon.local().toISO()
            
            let AssetData = require('./models/AssetData')
            
            new AssetData({
                ticker : isin,
                type : "fund",
                date : date,
                price : parseFloat(data.price),
                baseCurrency : baseCurrency
            }).save((err, savedAssetData) => {
                if (err) console.log(err)
                else {
                    console.log(savedAssetData)
                    funcs.callFuncIfExists(success, data.price)
                }
            })

        })
        .catch(function (error) {
            console.error(error);
            funcs.callFuncIfExists(failure, error)
        });
    } else {
        let err = "Error loading fund date, invalid ISIN code"
        console.log(err)
        funcs.callFuncIfExists(failure, err)
    }

}




module.exports.updateFundData = module.exports.loadFundData

