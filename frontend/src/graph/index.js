
import types from './types'
//import queries from './queries'
//import mutations from './mutations'

// assign types to the root for back compat
let graph = { ... types }

graph.types = types
//graph.queries = queries
//graph.mutations = mutations

export default graph