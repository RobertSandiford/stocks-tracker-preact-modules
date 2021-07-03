
const entityName = "Fx"
      
module.exports = {
    [entityName] : {
        type : `{
            toCurr : String!
            fromCurr : String!
            date : String
            rate : Float
        }`
    }
}