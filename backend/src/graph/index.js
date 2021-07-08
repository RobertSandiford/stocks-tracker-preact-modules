
const scalars = require('./scalars/scalars')
const entities = require('./entities')

//const lib = require('./lib')
//const entities2 = lib.load(__dirname + '/entities')
//console.log('entities2', entities2)

const { typeDefs, resolvers, requests }
    = require('./graphqlSchemaBuilder')({
        scalars,
        entities
    })


module.exports.typeDefs = typeDefs
module.exports.resolvers = resolvers
module.exports.requests = requests