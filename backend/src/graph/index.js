
import scalars from './scalars/scalars'
import entities from './entities'

//const lib = require('./lib')
//const entities2 = lib.load(__dirname + '/entities')
//console.log('entities2', entities2)

import typeDefsresolversrequestsFactory from './graphqlSchemaBuilder'

const { typeDefs, resolvers, requests } = typeDefsresolversrequestsFactory({
    scalars,
    entities
})


export { typeDefs, resolvers, requests }