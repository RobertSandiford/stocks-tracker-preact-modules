const { gql } = require('apollo-server-express')

module.exports = function (input) {

    let scalars = input.scalars || {}
    let types = input.types || {}
    let queries = input.queries || {}
    let mutations = input.mutations || {}

    ////// typeDefs
    let typeDefs = ""


    //// queries
    typeDefs = `type Query {\n`
    for ( const [queryName, query] of Object.entries(queries) ) {
        typeDefs += `  ${queryName}${query.query}\n`
    }
    typeDefs += `}\n`
    //// end queries


    //// mutations
    typeDefs += `type Mutation {\n`

    // main mutations
    for ( const [mutationName, mutation] of Object.entries(mutations) ) {
        typeDefs += `  ${mutationName}${mutation.mutation}\n`
    }

    // mutations from queries mutations
    for ( const [queryName, query] of Object.entries(queries) ) {
        if (typeof query.mutations == "object") {
            for ( const [mutationName, mutation] of Object.entries(query.mutations) ) {
                typeDefs += `  ${mutationName}${mutation.mutation}\n`
            }
        }
    }

    typeDefs += `}\n`
    //// end mutations


    //// Other types
    // main types
    if (typeof types !== "undefined") {
        for ( const [typeName, type] of Object.entries(types) ) {
            typeDefs += `type ${typeName} ${type}\n`
        }
    }

    // types from queries input
    for ( const [queryName, query] of Object.entries(queries) ) {
        if (query.hasOwnProperty('types')) {
            for ( const [typeName, type] of Object.entries(query.types) ) {
                typeDefs += `type ${typeName} ${type}\n`
            }
        }
    }

    // types from scalars
    for ( const name in scalars ) {
        typeDefs += `scalar ${name}\n`
    }
    //// end other types

    //console.log(typeDefs)
    

    typeDefs = gql(typeDefs)
    ////// end typeDefs




    ////// resolvers
    let resolvers = {}
    
    //// Query resolvers
    resolvers.Query = {}

    // resolvers from queries
    for ( const [queryName, query] of Object.entries(queries) ) {
        resolvers.Query[queryName] = query.resolver
    }
    //// End Query resolvers

    //// Mutation resolvers
    resolvers.Mutation = {}
    
    // resolvers from mutations
    for ( const [mutationName, mutation] of Object.entries(mutations) ) {
        resolvers.Mutation[mutationName] = mutation.resolver
    }

    // resolvers from queries mutations
    for ( const [queryName, query] of Object.entries(queries) ) {
        if (typeof query.mutations == "object") {
            for ( const [mutationName, mutation] of Object.entries(query.mutations) ) {
                resolvers.Mutation[mutationName] = mutation.resolver
            }
        }
    }
    //// End Mutation resolvers

    // resolvers from scalars
    for ( const [name, value] of Object.entries(scalars) ) {
        resolvers[name] = value
    }
    //// end resolvers


    return { typeDefs : typeDefs, resolvers : resolvers }
}