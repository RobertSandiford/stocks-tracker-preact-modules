
module.exports = function (input) {

    const scalars = input.scalars || {}
    //const types = input.types || {}
    //const inputs = input.types || {}
    //const queries = input.queries || {}
    //const mutations = input.mutations || {}
    const entities = input.entities || {}

    const schemaTypes = []
    const schemaTypesRegistry = {}
    const schemaInputs = []
    const schemaScalars = []
    const schemaResolvers = {}
    const schemaQueries = []
    const schemaQueryResolvers = {}
    const schemaMutations = []
    const schemaMutators = {}


    for ( const scalarName in scalars ) {
        const scalarResolver = scalars[scalarName]
        schemaScalars.push(`scalar ${scalarName}`)
        schemaResolvers[scalarName] = scalarResolver
    }

    for ( const [entityName, entityData] of Object.entries(entities) ) {

        if ( entityData.type !== undefined ) {
            schemaTypes.push(`type ${entityName} ${entityData.type}`)
            schemaTypesRegistry[entityName] = entityData.type
        }

        if ( entityData.types !== undefined ) {
            for ( const [typeName, type] of Object.entries(entityData.types) ) {
                schemaTypes.push(`type ${typeName} ${type}`)
                schemaTypesRegistry[typeName] = type
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
                        schemaTypesRegistry[typeName] = type
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
                        schemaTypesRegistry[typeName] = type
                    }
                }
            }
        }
    }

    //function objectConcat (o, prelim = '') {
    //    return Object.entries(o)
    //        .map( ([k, v]) => ((prelim) ? `prelim ` : ``) + `${k} ${v}\n` )
    //        .join('')
    //}

    let typeDefs
    typeDefs = schemaScalars.map(x => `${x}\n`).join('')
    typeDefs += schemaTypes.map(x => `${x}\n`).join('')
    //typeDefs += Object.entries(schemaTypes).map( ([k, v]) => `type ${k} ${v}\n` ).join('')
    //typeDefs += objectConcat(schemaTypes)
    typeDefs += schemaInputs.map(x => `${x}\n`).join('')
    typeDefs += `type Query {\n`
    typeDefs += schemaQueries.map(x => `    ${x}\n`).join('')
    typeDefs += `}\n`
    typeDefs += `type Mutation {\n`
    typeDefs += schemaMutations.map(x => `    ${x}\n`).join('')
    typeDefs += `}\n`


    const resolvers = {
        ...schemaResolvers,
        Query : schemaQueryResolvers,
        Mutation : schemaMutators,
    }

    //console.log(typeDefs)
    //console.log(resolvers)

    const graphObjects = {
        types : schemaTypes,
        typesRegistry : schemaTypesRegistry,
        inputs : schemaInputs,
        scalars : schemaScalars,
        resolvers : schemaResolvers,
        queries : schemaQueries,
        queryResolvers : schemaQueryResolvers,
        mutations : schemaMutations,
        mutators : schemaMutators
    }

    const requests = require('./graphqlRequestsMaker')(graphObjects)

    return { typeDefs, resolvers, requests }

}