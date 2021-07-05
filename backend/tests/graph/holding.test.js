require('dotenv').config()
const { createApp } = require('../../src/app')
const { GraphQLClient : GraphqlClient, gql } = require('graphql-request')
const graphqlRequests = require('../../src/graph/requests')


let app

const port = (Number(process.env.port) + 1) || console.log("Error, no port specified in .env")

const graphqlEndpoint = `http://localhost:${port}/graphql`
const graphqlClient = new GraphqlClient(graphqlEndpoint, { headers: {} })
const graphqlRequest = graphqlClient.request.bind(graphqlClient)

beforeAll( async () => {
    app = await createApp()
    await app.start(port)
})

/*
describe("The application", () => {
    test('was created', () => {
        expect(app.name).toBe('app')
    })
})
*/

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

describe("The getHolding query", () => {
    test('can retrieve holding with id "60decb7ad4c2c861dcc9dd6d" via getHolding', async () => {
        const response = await graphqlRequests.getHolding(
            "60decb7ad4c2c861dcc9dd6d"
        )
        expect( response.holding ).not.toBeUndefined()
    })
})


describe("The getHolding{s} query", () => {
    test('can retrieve holdings', async () => {
        const response = await graphqlRequests.getHoldings({
            user : 1,
            displayCurrency : "USD"
        })
        //console.log("getHoldings response", response)
        expect( response.holdings ).not.toBeUndefined()
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

        expect( response ).not.toBeUndefined()
        expect( response.holding ).not.toBeNull()

    })
})



describe("The updateHolding mutation", () => {
    test('Holding "60e3412f813ceb24bc0c8370" can be updated', async () => {

        const id = "60e3412f813ceb24bc0c8370"
        const response1 = await graphqlRequests.getHolding(id)

        expect( response1.holding._id ).toBe(id)

        const response2 = await graphqlRequests.updateHolding({
            _id : id,
            name: "Test",
            ticker: "BCA",
            quantity: 1
        })

        expect( response2.holding.ticker ).toBe('BCA')


    })
})



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

        expect(response2.status).toBe("OK")

        const response3 = await graphqlRequests.getHolding(
            newHolding._id
        )

        expect(response3.status).toBe("Not Found")

    })
})


afterAll( async () => {
    app.stop()
})
