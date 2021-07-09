import dotenv from 'dotenv'
dotenv.config()

import { DateTime as Luxon, Settings as LuxonSettings } from 'luxon'
LuxonSettings.defaultLocale = "en-GB"
const stDateFormat = Object.assign(Luxon.DATE_MED, { })

import axios from 'axios'
import * as funcs from './apiFuncs'

const apiKey = process.env.funds_api_key
const apiHost = process.env.funds_api_host

import AssetData from '../models/AssetData'

export const loadFundData = async function (isin, baseCurrency, success, failure/*, baseCurr = "USD"*/) {
    isin = isin.toUpperCase()
    baseCurrency = baseCurrency.toUpperCase()

    console.log("load fund data")

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
            const data = response.data
            // data.price
            // data.market
            console.log(data)

            const date = Luxon.local().toISO()
            
           
            
            new AssetData({
                ticker : isin,
                type : "fund",
                date,
                price : parseFloat(data.price),
                baseCurrency
            }).save((err, savedAssetData) => {
                if (err) console.log(err)
                else {
                    console.log(savedAssetData)
                    funcs.callFuncIfExists(success, data.price)
                }
            })

        })
        .catch(function (error) {
            console.error(error)
            funcs.callFuncIfExists(failure, error)
        })
    } else {
        const err = "Error loading fund date, invalid ISIN code"
        console.log(err)
        funcs.callFuncIfExists(failure, err)
    }

}

export const updateFundData = loadFundData

