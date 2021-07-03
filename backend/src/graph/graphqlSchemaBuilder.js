const { gql } = require('apollo-server-express')

module.exports = function (input) {

    const scalars = input.scalars || {}
    const types = input.types || {}
    const inputs = input.types || {}
    const queries = input.queries || {}
    const mutations = input.mutations || {}
    const entities = input.entities || {}

    let schemaTypes = []
    let schemaInputs = []
    let schemaScalars = []
    let schemaResolvers = {}
    let schemaQueries = []
    let schemaQueryResolvers = {}
    let schemaMutations = []
    let schemaMutators = {}



    for ( const scalarName in scalars ) {
        const scalarResolver = scalars[scalarName]
        schemaScalars.push(`scalar ${scalarName}`)
        schemaResolvers[scalarName] = scalarResolver
    }

    for ( const [entityName, entityData] of Object.entries(entities) ) {

        if ( entityData.type !== undefined ) {
            schemaTypes.push(`type ${entityName} ${entityData.type}`)
        }

        if ( entityData.types !== undefined ) {
            for ( const [typeName, type] of Object.entries(entityData.types) ) {
                schemaTypes.push(`type ${typeName} ${type}`)
            }
        }

        if ( entityData.input !== undefined ) {
            schemaInputs.push(`input ${entityName}Input ${entityData.input}`)
        }

        if ( entityData.inputs !== undefined ) {
            for ( const [inputName, input] of Object.entries(entityData.inputs) ) {
                schemaInputs.push(`input ${inputName} ${input}`)
            }
        }

        if ( entityData.queries !== undefined ) {
            for ( const [queryName, query] of Object.entries(entityData.queries) ) {
                schemaQueries.push(`${queryName} ${query.format}`)
                schemaQueryResolvers[queryName] = query.resolver

                if ( query.types !== undefined ) {
                    for ( const [typeName, type] of Object.entries(query.types) ) {
                        schemaTypes.push(`type ${typeName} ${type}`)
                    }
                }
            }
        }

        if ( entityData.mutations !== undefined ) {
            for ( const [mutationName, mutation] of Object.entries(entityData.mutations) ) {
                schemaMutations.push(`${mutationName} ${mutation.format}`)
                schemaMutators[mutationName] = mutation.mutator

                if ( mutation.types !== undefined ) {
                    for ( const [typeName, type] of Object.entries(mutation.types) ) {
                        schemaTypes.push(`type ${typeName} ${type}`)
                    }
                }
            }
        }
    }

    let typeDefs
    typeDefs = schemaScalars.map(x => `${x}\n`).join('')
    typeDefs += schemaTypes.map(x => `${x}\n`).join('')
    typeDefs += schemaInputs.map(x => `${x}\n`).join('')
    typeDefs += `type Query {\n`
    typeDefs += schemaQueries.map(x => `    ${x}\n`).join('')
    typeDefs += `}\n`
    typeDefs += `type Mutation {\n`
    typeDefs += schemaMutations.map(x => `    ${x}\n`).join('')
    typeDefs += `}\n`


    let resolvers = {
        ...schemaResolvers,
        Query : schemaQueryResolvers,
        Mutation : schemaMutators,
    }

    //console.log(typeDefs)
    //console.log(resolvers)

    return { typeDefs, resolvers }


    /*

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

    */

}