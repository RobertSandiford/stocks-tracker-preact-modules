
const entityName = "Fx"

export default {
    [entityName] : {
        type : `{
            toCurr : String!
            fromCurr : String!
            date : String
            rate : Float
        }`
    }
}