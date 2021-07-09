
const { expect } = require('chai')
require('colors')

const react = require('react')
//const { h } = require('preact')
const fetch = require('cross-fetch')
const { ApolloClient, InMemoryCache, gql, HttpLink }
    = require('@apollo/client')
//const graph = require('../src/graphEs5/index')


/*
import { expect } from 'chai'
import 'colors'

import react from 'react'
import fetch from 'cross-fetch'
import { ApolloClient, InMemoryCache, gql, HttpLink }
    from '@apollo/client'
import graph from '../src/graph'
*/


apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    //uri: "http://localhost:4000/graphql",
    link: new HttpLink({ uri: 'http://localhost:4000/graphql', fetch })
})

let graph


console.log( `graphqlRequests.test`.blue.bold )

before( async () => {
    /*
    ;({ expect } = await import('chai'))
    await import('colors')
    
    react = await import('react')
    //const { h } = require('preact')
    fetch = await import('node-fetch')
    ;({ ApolloClient, InMemoryCache, gql, HttpLink }
        = await import('@apollo/client'))
    */

    graph = (await import('../src/graph/index.js')).default
    //graph = await import('../src/graphEs5/index.js')
    //graph = await import('../src/graphMjs/index.mjs')

})

describe('getHoldings request'.yellow, () => {
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
                exchangeRates ${graph.ExchangeRate}
            }
        }`
        
        //console.log(query.green)

        const result = await apolloClient.query({ query: gql(query) })
        
        expect(result.data.getHoldings.holdings).to.not.be.undefined

        console.log("graphql holdings: ", result)
        

        //let r = result.data.getHoldings
        //if ( r !== null ) {
        //    let s = objectWithTheseFields(r, ["holdings", "groups", "fx"])
        //    console.log("update store 1", s)
        //    this.props.updateStore(s)
        //} else {
        //
        //}


    })
})

after( async () => {
        
})
