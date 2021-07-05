
const { GraphQLScalarType } = require('graphql')

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize (value) {
        return value.toISOString() // Convert outgoing Date to integer for JSON
    },
    parseValue (value) {
        return new Date(value) // Convert incoming integer to Date
    },
    parseLiteral (ast) {
        return new Date(ast.value)
    },
})

module.exports = {
    Date : dateScalar
}