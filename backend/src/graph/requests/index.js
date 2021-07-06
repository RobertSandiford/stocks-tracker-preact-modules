require('dotenv').config()
const { GraphQLClient : GraphQlClient, gql } = require('graphql-request')
const { formatInputData, formatInnerInputData, formatSingleInputData } = require('./funcs')

const port = (Number(process.env.port) + 1) || console.log("Error, no port specified in .env")

const graphQlEndpoint = `http://localhost:${port}/graphql`
const graphQlClient = new GraphQlClient(graphQlEndpoint, { headers: {} })
const graphQlRequest = graphQlClient.request.bind(graphQlClient)



const HoldingType = `{
    _id
    name
    ticker
}`

const GetHoldingResponseType = `{
    status
    reason
    holding ${HoldingType}
}`

const GetHoldingsResponseType = `{
    status
    reason
    holdings ${HoldingType}
}`

const AddHoldingResponseType = `{
    status
    reason
    holding ${HoldingType}
}`

const UpdateHoldingResponseType = `{
    status
    reason
    holding ${HoldingType}
}`

const DeleteHoldingResponseType = `{
    status
    reason
    holdingId
}`


// AddHolding
// Input:
// holdingData: {
//     name: String
//     ticker: String
//     quantity: Int
//     and more stuff
// }
// Output:
// holding : {
//     lala
// }

function makeRequestFunction (type, name, defaultOutput) {
    return async (input, requestedData = defaultOutput) => {
        input = formatInputData(input)
        const query = gql`${type} {
            ${name}(${input}) ${requestedData}
        }`
        const response = await graphQlRequest(query)
        return response[name]
    }
}
const testFunc1 = makeRequestFunction('query', 'getHolding', GetHoldingResponseType)


function makeSingleInputRequestFunction (type, name, inputFormat, defaultOutput) {
    return async (input, requestedData = defaultOutput) => {
        input = formatSingleInputData(input)
        const query = gql`${type} {
            ${name}(${inputFormat} ${input}) ${requestedData}
        }`
        const response = await graphQlRequest(query)
        return response[name]
    }
}
const testFunc2 = makeSingleInputRequestFunction('query', 'getHolding', 'holdingId:', GetHoldingResponseType)


module.exports.getHolding = async (holdingId, requestedData = GetHoldingResponseType) => {
    
    const queryName = 'getHolding'

    holdingId = formatSingleInputData(holdingId)
    //requestedData = formatInputData(requestedData)

    const query = gql`query {
        ${queryName}(holdingId: ${holdingId}) ${requestedData}
    }`

    //console.log('getHolding query', query)
    const response = await graphQlRequest(query)
    return response[queryName]
}

module.exports.getHoldings = async (user, requestedData = GetHoldingsResponseType) => {
    
    const queryName = 'getHoldings'

    user = formatInputData(user)
    //requestedData = formatInputData(requestedData)

    const query = gql`query {
        ${queryName}(${user}) ${requestedData}
    }`
    //console.log("getHoldings query", query)
    const response = await graphQlRequest(query)
    return response[queryName]
}


module.exports.addHolding = async (holdingData, requestedData = AddHoldingResponseType) => {
    
    const mutationName = 'addHolding'

    holdingData = formatInputData(holdingData)
    //requestedData = formatInputData(requestedData)

    const query = gql`mutation {
        ${mutationName}(${holdingData}) ${requestedData}
    }`
    //console.log("addHolding query", query)
    const response = await graphQlRequest(query)
    return response[mutationName]
}

module.exports.updateHolding = async (holdingData, requestedData = UpdateHoldingResponseType) => {
    
    const mutationName = 'updateHolding'

    holdingData = formatInnerInputData(holdingData)
    //requestedData = formatInputData(requestedData)
    
    const query = gql`mutation {
        ${mutationName}(holdingData: ${holdingData}) ${requestedData}
    }`
    const response = await graphQlRequest(query)
    return response[mutationName]
}

module.exports.deleteHolding = async (holdingId, requestedData = DeleteHoldingResponseType) => {
    
    const mutationName = 'removeHolding'

    holdingId = formatSingleInputData(holdingId)
    //requestedData = formatInputData(requestedData)
    
    const query = gql`mutation {
        ${mutationName}(holdingId: ${holdingId}) ${requestedData}
    }`
    const response = await graphQlRequest(query)
    return response[mutationName]
}