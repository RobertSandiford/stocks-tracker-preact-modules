//require('dotenv').config()
//const { createApp } = require('../../src/app')
import * as graphqlRequestsMaker from '../../src/graph/graphqlRequestsMaker'

import entities from '../../src/graph/entities'
//const { gql } = require('graphql-request')
//const setup = require('../setup')
//const teardown = require('../teardown')


function stripSpace(x) {
    return x
        
        // remove newlines to test equality? -- problematic
        //.replace(/\n/g, '')
        //.replace(/\r/g, '')

        // remove any tabs
        .replace('\t', '')

        // regex
        // remove any spaces at the start of a line
        // ^ start of the string
        // + one or more characters
        // m makes ^ match the start of the string or the start of any line
        // g multiple replaces
        .replace(/^ +/mg, '')
}


/*
beforeAll( async () => {
    //app = await createApp()
    //await app.start(port)
})
*/

describe("The parseTypeToRequest function", () => {
    test('F2 parses "Holding" into the correct fields', async () => {
        
        const type = entities.Holding.type
        //console.log("type", type)

        const typesRegistry = {
            Holding : entities.Holding.type,
            HoldingOpen : entities.HoldingOpen.type,
            HoldingClose : entities.HoldingClose.type,
        }

        const requestedData = graphqlRequestsMaker
            .parseTypeToRequest(typesRegistry, type)

        const expected = `{
    _id
    name
    ticker
    exchangeName
    exchangeTicker
    type
    group
    region
    quantity
    buyUnitPrice
    buyTotalPrice
    buyCurrency
    buyDate
    buyRate
    fees
    currentUnitPrice
    currentTotalPrice
    priceCurrency
    currentPriceDate
    currentRate
    opens {
        _id
        name
        quantity
        buyUnitPrice
        buyTotalPrice
        buyDate
        buyRate
        fees
    }
    closes {
        _id
        name
        quantity
        sellUnitPrice
        sellTotalPrice
        sellDate
        sellRate
        fees
    }
}`

        expect( stripSpace(requestedData) )
            .toBe( stripSpace(expected) )
        
    })
})


/*
afterAll( async () => {
    //teardown(app)
})
*/

export default {}