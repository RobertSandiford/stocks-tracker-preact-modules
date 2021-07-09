
import { GraphQLScalarType } from 'graphql'

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) { // Convert Date to string for output
        return value.toISOString()
    },
    parseValue(value) { // Convert incoming date string to JS Date
        return new Date(value)
    },
    parseLiteral({value}) {
        return new Date(value)
    },
})

export default {
    Date : dateScalar
}