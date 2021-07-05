require('dotenv').config()
const express = require('express')
const supertest = require('supertest')
const { createApp } = require('../../src/app')
const { GraphQLClient : GraphQlClient, request : graphqlRequest, gql } = require('graphql-request')

let app

const port = (Number(process.env.port) + 1) || console.log("Error, no port specified in .env")

const graphQlEndpoint = `http://localhost:${port}/graphql`
const graphQlClient = new GraphQlClient(graphQlEndpoint, { headers: {} })
const graphQlRequest = graphQlClient.request.bind(graphQlClient)

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

    test('can retrieve holding with id "60decb7ad4c2c861dcc9dd6d" via apollo', async () => {
        
        const query = gql`{
            holding(_id: "60decb7ad4c2c861dcc9dd6d") {
                _id
                name
                ticker
            }
        }`
        
        const response = await graphQlRequest(query)

        expect( response.holding ).not.toBeUndefined()

    })

})


describe("The addHolding mutation", () => {
    test('A holding can be added', async () => {

        const query = gql`mutation {
            addHolding(holdingData: {
                name: "Test"
                ticker: "ABC"
                quantity: 1
            }) {
                holding {
                    _id
                    name
                    ticker
                }
            }
        }`
        
        const response = await graphQlRequest(query)

        //console.log(response)

        expect( response.addHolding ).not.toBeUndefined()
        expect( response.addHolding.holding ).not.toBeNull()

    })
})


/*
describe("The updateHolding mutation", () => {
    test('', () => {
    })
})
*/

/*
describe("The removeHolding mutation", () => {
    test('', () => {
    })
})
*/

afterAll( async () => {
    app.stop()
})
