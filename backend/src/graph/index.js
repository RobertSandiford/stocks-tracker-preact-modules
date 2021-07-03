
//const types = require('./types')
const scalars = require('./scalars')
//const queries = require('./queries')
//const mutations = require('./mutations')

const entities = require('./entities')

const { typeDefs, resolvers } = require('./graphqlSchemaBuilder')({
    scalars,
    entities
})


module.exports.typeDefs = typeDefs
module.exports.resolvers = resolvers