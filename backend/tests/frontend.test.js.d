  
const expect = require('chai').expect
require('colors')
require('../testGlobals')


const test = it

//require('dotenv').config()
//const { gql } = require('graphql-request')


console.log("start holding.test".blue)



const setup = require('../setup')
const teardown = require('../teardown')
let app
let graphqlRequests

before( async () => {
    const res = await setup()
    app = res.app
    graphqlRequests = res.graphqlRequests
})


/*
describe("The getHolding<s> query", () => {
    test('can retrieve holdings', async () => {

        try {
            const response = await graphqlRequests.getHoldings({
                user : 1,
                displayCurrency : "USD",
                secondCurrency : "GBP"
            })
            //console.log("getHoldings response", response)
            expect( response.holdings ).to.not.be.undefined
        } catch(e) {
            requestError(e)
        }

    })
})
*/

after( async () => {
    await teardown(app)
    //app.destroy()
})
