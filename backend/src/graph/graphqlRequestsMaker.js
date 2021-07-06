require('dotenv').config()
const { GraphQLClient : GraphQlClient, gql } = require('graphql-request')
const { formatInputData } = require('./requests/funcs')

const port = (Number(process.env.port) + 1) || console.log("Error, no port specified in .env")
const graphQlEndpoint = `http://localhost:${port}/graphql`
const graphQlClient = new GraphQlClient(graphQlEndpoint, { headers: {} })
const graphQlRequest = graphQlClient.request.bind(graphQlClient)

function generateFunction (objects, type, name, format) {
    
    const r = async (input, requestedData = '') => {
        
        input = formatInputData(input)
        //requestedData = formatInputData(requestedData)

        if (requestedData === '') {
            let returnType = format.split(":").slice(-1).pop().trim()

            //// somewhere here the !s need to be stripped from
            //// multi return type queries
            if ( returnType.slice(-1) == '!' )
                returnType = returnType.slice(0, -1)

            if ( returnType in objects.types )
                requestedData = objects.types[returnType]
            else
                requestedData = returnType
        }

        const query = gql`${type} {
            ${name}(${input}) ${requestedData}
        }`

        const response = await graphQlRequest(query)
        return response[name]
    }

    return r
}


module.exports = function (objects) {

    const requests = {}

    for ( const queryFormat of objects.queries ) {

        const queryName = queryFormat.split(' ').splice(0, 1).pop()
        const queryResolver = objects.queryResolvers[queryName]

        const r = generateFunction(objects, 'query', queryName, queryFormat)

        requests[queryName] = r
    }

    for ( const mutationFormat of objects.mutations ) {
        
        const mutationName = mutationFormat.split(' ').splice(0, 1).pop()
        const mutator = objects.mutators[mutationName]

        const r = generateFunction(objects, 'mutation', mutationName, mutationFormat)

        requests[mutationName] = r
    }

}