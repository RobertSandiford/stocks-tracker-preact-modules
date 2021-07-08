/*const { expect } = require('chai')
require('colors')

const react = require('react')
//const { h } = require('preact')
const fetch = require('cross-fetch')
const { ApolloClient, InMemoryCache, gql, HttpLink }
    = require('@apollo/client')
const graph = require('../src/graph/index')*/

import { expect } from 'chai'
import 'colors'

import react from 'react'
import fetch from 'cross-fetch'
import { ApolloClient, InMemoryCache, gql, HttpLink }
    from '@apollo/client'
import graph from '../src/graph'


const apolloClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: '/graphql', fetch })
})

console.log( `graphqlRequests.test`.blue )

before( () => {

})

describe('getHoldings request', () => {
    it('retrieves holdings', async () => {
 
        // load holdings
        let query = `query GetHoldings {
            getHoldings(
                user: 1
                displayCurrency : "USD"
                secondCurrency : "GBP"
            ) {
                status
                holdings ${graph.Holding}
                groups
                exchangeRates ${graph.ExchangeRates}
            }
        }`
        
        const result = await apolloClient.query({ query: gql(query) })
        
        console.log("graphql holdings", result.data)
        let r = result.data.getHoldings

        if ( r !== null ) {
            //let s = objectWithTheseFields(r, ["holdings", "groups", "fx"])
            //console.log("update store 1", s)
            //this.props.updateStore(s)
        } else {

        }


    })
})

after( () => {
    
})