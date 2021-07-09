import dotenv from 'dotenv'
dotenv.config()
import { GraphQLClient as GraphQlClient, gql } from 'graphql-request'
import { formatInputData } from './funcs'
//import supertest from 'supertest'

/*
const port = (Number(process.env.port) + 1) || console.log("Error, no port specified in .env")
const graphQlEndpoint = `http://localhost:${port}/graphql`
const graphQlClient = new GraphQlClient(graphQlEndpoint, { headers: {} })
const graphQlRequest = graphQlClient.request.bind(graphQlClient)
*/

/*
async function testRequest(test, url, query) {
    const res = await supertest(test.app)
        .post(url)
        .set({contentType: 'application/graphql'})
        .send(query)
    return res
}
*/

/*
function parseTypeToRequest(typesRegistry, type) {
    let lines = type.split('\n')
    lines = lines.map( line => {
        //console.log("line", line)
        if ( line.includes('{') || line.includes('}') )
            return line.trim()

        let newLine
        const parts = line.split(":")
        //console.log("parts len", parts.length)
        const name = parts[0].trim()
        const type = parts[1]
            .replace('!', '').replace('[', '')
            .replace(']', '').replace(',', '').trim()
        //console.log("type", type)
        if ( type in typesRegistry ) {
            //console.log("in registry: ", type)
            newLine = name + ' '
                + parseTypeToRequest(typesRegistry, typesRegistry[type])
        } else {
            newLine = name
        }
        //console.log("newLine", newLine)
        return newLine
    } )
    const output = lines.join('\n')
    //console.log("parseTypeToRequest", output)
    return output
}
*/

// do a regex replace
function parseTypeToRequest(typesRegistry, type) {

    const symbolFindingRegex = /(?<={.*?)([a-zA-Z_]+\s*:\s*[a-zA-Z_\[\]!]+)(?=.*?})/sg
    
    const output = type.replace(symbolFindingRegex, x => {
        
        const parts = x.split(":")
        //console.log("parts len", parts.length)
        const name = parts[0].trim()
        const type = parts[1]
            .replace('[', '').replace(']', '')
            .replace('!', '').trim()

        if ( type in typesRegistry ) {
            return name + ' ' + parseTypeToRequest(
                typesRegistry, typesRegistry[type])
        } else {
            return name
        }
    })

    return output

    /*
    
    let char
    const output = []
    let word = ""
    let expected = "name"
    for (let i = 0; i < type.length; i++) {
        char = type.charAt(i)
        if (char === "{") output.push(char)
        if (char === "}") output.push(char)
        // build words
        // if white space
        if ( char.match(/[_a-zA-Z/]/) ) {
            word += char
        } else {
            if ( word.length > 0 ) {
                //console.log("word found: ", word, expected)
                // process word
                switch (expected) {
                    case "name":
                        //console.log("outputting: ", word)
                        output.push(word)
                        expected = "type"
                        break
                    case "type":
                        if ( word in typesRegistry ) {
                            output[output.length-1]
                                += ' ' + parseTypeToRequest(
                                    typesRegistry,
                                    typesRegistry[word]
                                )
                        }
                        expected = "name"
                        break
                }
                word = ""
            }
        }
    }

    const outputString = output.join('\n')

    return outputString
    */
}


//// Unfinished project
function generateFunction(requests, objects, type, name, format) {
    
    const r = async (input, requestedData = '') => {
        
        input = formatInputData(input)
        //requestedData = formatInputData(requestedData)

        if (requestedData === '') {
            let returnType = format.split(":").slice(-1).pop().trim()

            returnType = returnType.replace('!', '')

            if ( returnType in objects.typesRegistry ) {
                requestedData = parseTypeToRequest(
                    objects.typesRegistry,
                    objects.typesRegistry[returnType])
            } else {
                requestedData = returnType
            }
        }

        const query = gql`${type} {
            ${name}(${input}) ${requestedData}
        }`
        
        //console.log('getHolding auto query', query)

        const response = await requests.graphQlRequest(query)
        return response[name]
    }

    return r
}


export default function (objects) {

    const requests = {}

    requests.configure = (url) => {
        const graphQlClient = new GraphQlClient(url, { headers: {} })
        const graphQlRequest = graphQlClient.request.bind(graphQlClient)
        //requests.graphQlClient = graphQlClient
        requests.graphQlRequest = graphQlRequest
    }

    requests.test = {}
    requests.test.configure = (app) => {
        requests.test.app = app
    }

    for ( const queryFormat of objects.queries ) {

        const queryName = queryFormat.split(' ').splice(0, 1).pop()
        //const queryResolver = objects.queryResolvers[queryName]

        const r = generateFunction(requests, objects, 'query', queryName, queryFormat)

        requests[queryName] = r
        requests.test[queryName] = r
    }

    for ( const mutationFormat of objects.mutations ) {
        
        const mutationName = mutationFormat.split(' ').splice(0, 1).pop()
        //const mutator = objects.mutators[mutationName]

        const r = generateFunction(requests, objects, 'mutation', mutationName, mutationFormat)

        requests[mutationName] = r
        requests.test[mutationName] = r
    }

    return requests
};

export { parseTypeToRequest, generateFunction }