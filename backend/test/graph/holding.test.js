
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

    /*
    app = await createApp()
    const port = await app.start(0)
    const graphqlEndpoint = `http://localhost:${port}/graphql`
    graphqlRequests.configure(graphqlEndpoint)
    */

})


describe("The application", () => {
    test('was created', () => {
        expect(app.name).to.equal('app')
    })
})


/*
describe("The holding query", () => {

    test('can retrieve holding with id "60decb7ad4c2c861dcc9dd6d" via holding', async () => {
        const query = gql`{
            holding(holdingId: "60decb7ad4c2c861dcc9dd6d") {
                _id
                name
                ticker
            }
        }`
        const response = await graphqlRequest(query)
        expect( response.holding ).not.toBeUndefined()

    })
})
*/


describe("The getHolding query", () => {

    test('can retrieve holding with id "60decb7ad4c2c861dcc9dd6d" via getHolding', async () => {
        
        const response = await graphqlRequests.getHolding(
            `holdingId : "60decb7ad4c2c861dcc9dd6d"`
        )
        expect( response.holding ).to.not.be.undefined
    })

    /*
    test('with supertest, can retrieve holding with id "60decb7ad4c2c861dcc9dd6d" via getHolding', async () => {
        
        const query = gql`{
            getHolding(holdingId: "60decb7ad4c2c861dcc9dd6d") {
                _id
                name
                ticker
            }
        }`

        let response = await supertest(app)
            .post('/graphql')
            .set('Content-type', 'application/graphql')
            .send(query)

        expect( response ).to.not.be.undefined
    })
    */

})



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



describe("The addHolding mutation", () => {
    test('A holding can be added', async () => {

        const response = await graphqlRequests.addHolding({
            holdingInput : {
                name: "Test",
                ticker: "ABC",
                quantity: 1
            }
        })

        expect( response ).to.not.be.undefined
        expect( response.holding ).to.not.be.null

    })
})



describe("The updateHolding mutation", () => {
    test('Holding "60e3412f813ceb24bc0c8370" can be updated', async () => {

        const id = "60e3412f813ceb24bc0c8370"
        const response1 = await graphqlRequests.getHolding({
            holdingId : id
        })

        expect( response1.holding._id ).to.equal(id)

        const response2 = await graphqlRequests.updateHolding({
            holdingWithIdInput : {
                _id : id,
                name: "Test",
                ticker: "BCA",
                quantity: 1
            }
        })

        expect( response2.holding.ticker ).to.equal('BCA')


    })
})


/*
describe("The removeHolding mutation", () => {
    test('A holding can be deleted', async () => {

        const response = await graphqlRequests.addHolding({
            holdingInput : {
                name: "Test2",
                ticker: "ABC",
                quantity: 1
            }
        })

        const newHolding = response.holding

        const response2 = await graphqlRequests.deleteHolding(
            newHolding._id
        )

        expect(response2.status).to.equal("OK")

        const response3 = await graphqlRequests.getHolding(
            newHolding._id
        )

        expect(response3.status).toBe("Not Found")

    })
})
*/



after( async () => {
    await teardown(app)
    //app.destroy()
})
